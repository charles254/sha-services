import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail';
import { sendSMS, SMS_TEMPLATES } from '@/lib/sms';

/**
 * POST /api/mpesa/callback
 * Receives the Safaricom STK Push payment result.
 * Always returns { ResultCode: 0 } so Safaricom doesn't retry.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
    console.log('[mpesa/callback] Received:', JSON.stringify(body, null, 2));
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

    // ── PAYMENT SUCCESSFUL (ResultCode 0) ──────────────────────────────────
    if (resultCode === 0) {
      const metadata     = result.CallbackMetadata?.Item as { Name: string; Value: any }[];
      const mpesaReceipt = metadata?.find((i) => i.Name === 'MpesaReceiptNumber')?.Value as string | undefined;
      const amount       = metadata?.find((i) => i.Name === 'Amount')?.Value as number | undefined;
      const phone        = metadata?.find((i) => i.Name === 'PhoneNumber')?.Value as string | undefined;

      console.log(`[mpesa/callback] SUCCESS | Receipt: ${mpesaReceipt} | Amount: ${amount} | Phone: ${phone}`);

      // Find the order by CheckoutRequestID
      const order = await prisma.order.findFirst({
        where:   { checkoutId },
        include: { user: true, service: true },
      });

      if (!order) {
        console.error(`[mpesa/callback] No order found for checkoutId: ${checkoutId}`);
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // Mark order as PAID and save receipt number
      await prisma.order.update({
        where: { id: order.id },
        data:  {
          status:       'PAID',
          mpesaReceipt: mpesaReceipt ?? null,
        },
      });

      console.log(`[mpesa/callback] Order ${order.id} marked PAID`);

      // Fire-and-forget notifications
      Promise.allSettled([
        sendEmail(
          order.user.email,
          `✅ Payment Confirmed — ${order.service.name}`,
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
      // ── PAYMENT FAILED / CANCELLED ────────────────────────────────────────
      console.warn(`[mpesa/callback] Payment failed | ResultCode: ${resultCode} | ${result?.ResultDesc}`);
      // We don't update the order — it stays PENDING so customer can retry
    }
  } catch (error) {
    console.error('[mpesa/callback] Processing error:', error);
    // Still return success so Safaricom doesn't keep retrying
  }

  // Safaricom requires this exact response
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
