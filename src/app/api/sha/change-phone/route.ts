import { NextRequest, NextResponse } from 'next/server';
import { createShaOrder } from '@/lib/sha-services';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, shaPin, oldPhone, newPhone, idDocUrl, abstractDocUrl } = body;

    // ── Validation ─────────────────────────────────────
    if (!fullName?.trim())     return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    if (!email?.includes('@')) return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!shaPin?.trim())       return NextResponse.json({ error: 'SHA member number is required.' }, { status: 400 });
    if (!newPhone?.trim())     return NextResponse.json({ error: 'New phone number is required.' }, { status: 400 });
    if (!idDocUrl)             return NextResponse.json({ error: 'National ID document is required.' }, { status: 400 });
    if (!abstractDocUrl)       return NextResponse.json({ error: 'Police Abstract document is required.' }, { status: 400 });

    // ── Create Order ────────────────────────────────────
    const order = await createShaOrder({
      serviceKey: 'change-phone',
      name: fullName,
      email,
      phone: newPhone,
      notes: { shaPin, oldPhone: oldPhone || null, newPhone },
      documents: [
        { fileUrl: idDocUrl,       fileType: 'NATIONAL_ID' },
        { fileUrl: abstractDocUrl, fileType: 'POLICE_ABSTRACT' },
      ],
    });

    // ── Trigger STK Push ────────────────────────────────
    const mpesa = await initiateSTKPush(newPhone, order.service.price, order.id, order.service.name);

    if (mpesa.success && mpesa.checkoutRequestId) {
      await prisma.order.update({
        where: { id: order.id },
        data:  { checkoutId: mpesa.checkoutRequestId },
      });
    }

    return NextResponse.json(
      {
        success:         true,
        trackingId:      order.id,
        customerMessage: mpesa.customerMessage || 'Check your phone for the M-Pesa STK prompt.',
        mpesaSuccess:    mpesa.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /sha/change-phone]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
