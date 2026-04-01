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
    const { companyName, kraPin, registrationNo, phone, email, contactPerson, employees, industry, certDocUrl } = body;

    if (!companyName?.trim() || companyName.length > 200)
      return NextResponse.json({ error: 'Company name is required (max 200 chars).' }, { status: 400 });
    if (!kraPin?.trim() || !/^[AP]\d{9}[A-Z]$/.test(kraPin.trim()))
      return NextResponse.json({ error: 'Valid KRA PIN is required (e.g., A123456789B).' }, { status: 400 });
    if (!phone || !validatePhone(phone))
      return NextResponse.json({ error: 'Valid Kenyan phone number is required.' }, { status: 400 });
    if (!email || !validateEmail(email))
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!contactPerson?.trim() || contactPerson.length > 100)
      return NextResponse.json({ error: 'Contact person name is required (max 100 chars).' }, { status: 400 });
    if (!certDocUrl || !isAllowedDocUrl(certDocUrl))
      return NextResponse.json({ error: 'Valid Certificate of Incorporation is required.' }, { status: 400 });

    const order = await createShaOrder({
      serviceKey: 'employer-registration',
      name: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      phone,
      notes: { companyName: companyName.trim(), kraPin: kraPin.trim(), registrationNo: registrationNo || null, employees: employees || null, industry: industry || 'private' },
      documents: [{ fileUrl: certDocUrl, fileType: 'CERT_OF_INCORPORATION' }],
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
    console.error('[API /sha/employer-registration]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
