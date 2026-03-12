import { NextRequest, NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail';
import { sendSMS, SMS_TEMPLATES } from '@/lib/sms';
import prisma from '@/lib/prisma';

/**
 * POST /api/mpesa/stkpush
 * Body: { orderId: string }
 *
 * Looks up the order, fires an STK push to the user's phone,
 * saves the CheckoutRequestID to the order, and sends an email receipt.
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
    }

    // ── Fetch order with user + service ────────────────────────────────────────
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, service: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Order is already ${order.status}. Cannot initiate payment.` },
        { status: 409 }
      );
    }

    const amount = order.finalPrice ?? order.service.price;

    // ── Initiate STK Push ──────────────────────────────────────────────────────
    const mpesa = await initiateSTKPush(
      order.user.phone,
      amount,
      order.id,
      order.service.name
    );

    if (!mpesa.success) {
      console.error('[stkpush] Failed:', mpesa.error);
      return NextResponse.json(
        { error: 'M-Pesa payment could not be initiated. ' + mpesa.error },
        { status: 502 }
      );
    }

    // ── Save CheckoutRequestID to order ───────────────────────────────────────
    if (mpesa.checkoutRequestId) {
      await prisma.order.update({
        where: { id: order.id },
        data:  { checkoutId: mpesa.checkoutRequestId },
      });
    }

    // ── Fire-and-forget: email + SMS confirmation ─────────────────────────────
    Promise.allSettled([
      sendEmail(
        order.user.email,
        `📋 SHA Service Request Received — ${order.service.name}`,
        EMAIL_TEMPLATES.ORDER_RECEIVED(order.user.name, order.id, order.service.name, amount)
      ),
      sendSMS(
        order.user.phone,
        SMS_TEMPLATES.ORDER_RECEIVED(order.id, order.service.name, amount)
      ),
    ]).catch(() => {});

    return NextResponse.json(
      {
        success:         true,
        customerMessage: mpesa.customerMessage || 'Check your phone for the M-Pesa prompt.',
        checkoutId:      mpesa.checkoutRequestId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /mpesa/stkpush]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
