import { NextRequest, NextResponse } from 'next/server';
import { createShaOrder } from '@/lib/sha-services';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';
import { validatePhone, validateEmail, isAllowedDocUrl } from '@/lib/sanitize';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

type Beneficiary = { name: string; relation: string; dob?: string; idNumber?: string };

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const rl = checkRateLimit(`sha:${ip}`, { max: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { fullName, shaPin, idNumber, phone, email, beneficiaries, idDocUrl } = body;

    if (!fullName?.trim() || fullName.length > 100)
      return NextResponse.json({ error: 'Full name is required (max 100 chars).' }, { status: 400 });
    if (!shaPin?.trim() || shaPin.length > 20)
      return NextResponse.json({ error: 'SHA member number is required.' }, { status: 400 });
    if (!phone || !validatePhone(phone))
      return NextResponse.json({ error: 'Valid Kenyan phone number is required.' }, { status: 400 });
    if (!email || !validateEmail(email))
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!idDocUrl || !isAllowedDocUrl(idDocUrl))
      return NextResponse.json({ error: 'Valid National ID document is required.' }, { status: 400 });
    if (!Array.isArray(beneficiaries) || beneficiaries.length === 0 || beneficiaries.length > 10)
      return NextResponse.json({ error: 'Between 1 and 10 beneficiaries required.' }, { status: 400 });
    if (beneficiaries.some((b: Beneficiary) => !b.name?.trim() || b.name.length > 100))
      return NextResponse.json({ error: 'All beneficiary names are required (max 100 chars).' }, { status: 400 });

    const order = await createShaOrder({
      serviceKey: 'beneficiary-update',
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone,
      notes: { shaPin: shaPin.trim(), idNumber: idNumber || null, beneficiaries },
      documents: [{ fileUrl: idDocUrl, fileType: 'NATIONAL_ID' }],
    });

    const mpesa = await initiateSTKPush(phone, order.service.price, order.id, order.service.name);
    if (mpesa.success && mpesa.checkoutRequestId) {
      await prisma.order.update({ where: { id: order.id }, data: { checkoutId: mpesa.checkoutRequestId } });
    }

    return NextResponse.json(
      { success: true, trackingId: order.id, customerMessage: mpesa.customerMessage || 'Check your phone for M-Pesa prompt.', mpesaSuccess: mpesa.success },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /sha/beneficiary-update]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
