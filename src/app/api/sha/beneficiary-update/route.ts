import { NextRequest, NextResponse } from 'next/server';
import { createShaOrder } from '@/lib/sha-services';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';

type Beneficiary = { name: string; relation: string; dob?: string; idNumber?: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, shaPin, idNumber, phone, email, beneficiaries, idDocUrl } = body;

    if (!fullName?.trim())     return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    if (!shaPin?.trim())       return NextResponse.json({ error: 'SHA member number is required.' }, { status: 400 });
    if (!phone?.trim())        return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    if (!email?.includes('@')) return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (!idDocUrl)             return NextResponse.json({ error: 'National ID document is required.' }, { status: 400 });
    if (!Array.isArray(beneficiaries) || beneficiaries.length === 0)
      return NextResponse.json({ error: 'At least one beneficiary is required.' }, { status: 400 });
    if (beneficiaries.some((b: Beneficiary) => !b.name?.trim()))
      return NextResponse.json({ error: 'All beneficiary names are required.' }, { status: 400 });

    const order = await createShaOrder({
      serviceKey: 'beneficiary-update',
      name: fullName, email, phone,
      notes: { shaPin, idNumber: idNumber || null, beneficiaries },
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
