import { NextRequest, NextResponse } from 'next/server';
import { createShaOrder } from '@/lib/sha-services';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';
import { validatePhone, validateEmail, isAllowedDocUrl } from '@/lib/sanitize';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const rl = checkRateLimit(`sha:${ip}`, { max: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { fullName, email, shaPin, oldPhone, newPhone, idDocUrl, abstractDocUrl } = body;

    // Validation
    if (!fullName?.trim() || fullName.length > 100)
      return NextResponse.json({ error: 'Full name is required (max 100 chars).' }, { status: 400 });
    if (!email || !validateEmail(email))
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!shaPin?.trim() || shaPin.length > 20)
      return NextResponse.json({ error: 'SHA member number is required.' }, { status: 400 });
    if (!newPhone || !validatePhone(newPhone))
      return NextResponse.json({ error: 'Valid Kenyan phone number is required.' }, { status: 400 });
    if (!idDocUrl || !isAllowedDocUrl(idDocUrl))
      return NextResponse.json({ error: 'Valid National ID document is required.' }, { status: 400 });
    if (!abstractDocUrl || !isAllowedDocUrl(abstractDocUrl))
      return NextResponse.json({ error: 'Valid Police Abstract document is required.' }, { status: 400 });

    const order = await createShaOrder({
      serviceKey: 'change-phone',
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: newPhone,
      notes: { shaPin: shaPin.trim(), oldPhone: oldPhone || null, newPhone },
      documents: [
        { fileUrl: idDocUrl,       fileType: 'NATIONAL_ID' },
        { fileUrl: abstractDocUrl, fileType: 'POLICE_ABSTRACT' },
      ],
    });

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
