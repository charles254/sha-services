import { NextRequest, NextResponse } from 'next/server';
import { createShaOrder } from '@/lib/sha-services';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, kraPin, registrationNo, phone, email, contactPerson, employees, industry, certDocUrl } = body;

    if (!companyName?.trim())   return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
    if (!kraPin?.trim())        return NextResponse.json({ error: 'KRA PIN is required.' }, { status: 400 });
    if (!phone?.trim())         return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    if (!email?.includes('@'))  return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!contactPerson?.trim()) return NextResponse.json({ error: 'Contact person name is required.' }, { status: 400 });
    if (!certDocUrl)            return NextResponse.json({ error: 'Certificate of Incorporation is required.' }, { status: 400 });

    const order = await createShaOrder({
      serviceKey: 'employer-registration',
      name: contactPerson, email, phone,
      notes: { companyName, kraPin, registrationNo: registrationNo || null, employees: employees || null, industry: industry || 'private' },
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
