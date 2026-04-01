import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Rate limit: 30 track requests per minute per IP
  const ip = getClientIP(req);
  const rl = checkRateLimit(`track:${ip}`, { max: 30, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
    }

    // Basic format validation for the tracking ID
    if (id.length < 10 || id.length > 50) {
      return NextResponse.json({ error: 'Invalid Tracking ID format.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id:         true,
        status:     true,
        createdAt:  true,
        updatedAt:  true,
        service: {
          select: { name: true },
        },
        // Exclude: finalPrice, notes, documents (PII/sensitive data)
        // Only expose document count, not URLs
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No request found with that Tracking ID.' },
        { status: 404 }
      );
    }

    // Return sanitized response without PII
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        service: order.service.name,
        documentsUploaded: order._count.documents,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('[API /sha/track]', error);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
