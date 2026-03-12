import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id:         true,
        status:     true,
        finalPrice: true,
        createdAt:  true,
        updatedAt:  true,
        notes:      true,
        service: {
          select: { name: true, slug: true },
        },
        documents: {
          select: { fileType: true, fileUrl: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No request found with that Tracking ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('[API /sha/track]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
