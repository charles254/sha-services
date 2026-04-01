import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail';
import { sendSMS, SMS_TEMPLATES } from '@/lib/sms';
import { maskPII } from '@/lib/sanitize';

// Safaricom's known IP ranges for callback verification
const SAFARICOM_IP_PREFIXES = ['196.201.214.', '196.201.212.', '196.201.213.'];

function isSafaricomIP(ip: string): boolean {
  // In production, verify source IP. In dev, allow all.
  if (process.env.NODE_ENV !== 'production') return true;
  return SAFARICOM_IP_PREFIXES.some((prefix) => ip.startsWith(prefix));
}

/**
 * POST /api/mpesa/callback
 * Receives the Safaricom STK Push payment result.
 * Always returns { ResultCode: 0 } so Safaricom doesn't retry.
 */
export async function POST(req: NextRequest) {
  // Verify request comes from Safaricom
  const forwarded = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const clientIP = forwarded || req.headers.get('x-real-ip') || '';

  if (!isSafaricomIP(clientIP)) {
    console.warn(`[mpesa/callback] Rejected: untrusted IP ${clientIP}`);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  let body: Record<string, unknown>;

  try {
    body = await req.json();
    // Log without PII
    console.log('[mpesa/callback] Received callback');
  } catch {
    console.error('[mpesa/callback] Invalid JSON body');
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  try {
    const result          = (body.Body as any)?.stkCallback;
    const resultCode      = result?.ResultCode;
    const checkoutId      = result?.CheckoutRequestID as string | undefined;

    if (!checkoutId) {
      console.warn('[mpesa/callback] No CheckoutRequestID in payload');
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // PAYMENT SUCCESSFUL (ResultCode 0)
    if (resultCode === 0) {
      const metadata     = result.CallbackMetadata?.Item as { Name: string; Value: any }[];
      const mpesaReceipt = metadata?.find((i) => i.Name === 'MpesaReceiptNumber')?.Value as string | undefined;
      const amount       = metadata?.find((i) => i.Name === 'Amount')?.Value as number | undefined;
      const phone        = metadata?.find((i) => i.Name === 'PhoneNumber')?.Value as string | undefined;

      // Log with masked PII
      console.log(`[mpesa/callback] SUCCESS | Receipt: ${mpesaReceipt || 'N/A'} | Amount: ${amount} | Phone: ${phone ? maskPII(String(phone)) : 'N/A'}`);

      // Find the order by CheckoutRequestID
      const order = await prisma.order.findFirst({
        where:   { checkoutId },
        include: { user: true, service: true },
      });

      if (!order) {
        console.error(`[mpesa/callback] No order found for checkoutId: ${checkoutId}`);
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // Validate payment amount matches expected price
      if (amount !== undefined && amount !== order.finalPrice) {
        console.error(`[mpesa/callback] Amount mismatch: paid ${amount}, expected ${order.finalPrice} for order ${order.id}`);
        // Mark as PAID but flag the discrepancy in notes
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            mpesaReceipt: mpesaReceipt ?? null,
            notes: JSON.stringify({
              ...JSON.parse(order.notes as string || '{}'),
              _amountMismatch: { paid: amount, expected: order.finalPrice },
            }),
          },
        });
      } else {
        // Normal: mark order as PAID
        await prisma.order.update({
          where: { id: order.id },
          data:  {
            status:       'PAID',
            mpesaReceipt: mpesaReceipt ?? null,
          },
        });
      }

      console.log(`[mpesa/callback] Order ${order.id} marked PAID`);

      // Fire-and-forget notifications
      Promise.allSettled([
        sendEmail(
          order.user.email,
          `Payment Confirmed - ${order.service.name}`,
          EMAIL_TEMPLATES.PAYMENT_CONFIRMED(
            order.user.name,
            order.id,
            order.service.name,
            mpesaReceipt ?? 'N/A'
          )
        ),
        sendSMS(
          order.user.phone,
          SMS_TEMPLATES.PAYMENT_CONFIRMED(order.id, mpesaReceipt ?? 'N/A')
        ),
      ]).catch(() => {});
    } else {
      // PAYMENT FAILED / CANCELLED
      console.warn(`[mpesa/callback] Payment failed | ResultCode: ${resultCode}`);
    }
  } catch (error) {
    console.error('[mpesa/callback] Processing error:', error);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
