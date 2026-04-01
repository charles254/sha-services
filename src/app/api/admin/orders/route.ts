import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

// GET /api/admin/orders?status=&service=&search=&page=&limit=
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status  = searchParams.get('status')  || undefined;
  const search  = searchParams.get('search')  || '';
  const page    = Math.max(1, Number(searchParams.get('page')  || 1));
  const limit   = Math.min(50, Number(searchParams.get('limit') || 20));
  const skip    = (page - 1) * limit;

  try {
    const where = {
      ...(status ? { status: status as 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' } : {}),
      ...(search ? {
        OR: [
          { id:   { contains: search, mode: 'insensitive' as const } },
          { user: { name:  { contains: search, mode: 'insensitive' as const } } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
          { user: { phone: { contains: search, mode: 'insensitive' as const } } },
        ],
      } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id:           true,
          status:       true,
          finalPrice:   true,
          mpesaReceipt: true,
          createdAt:    true,
          updatedAt:    true,
          service: { select: { name: true, slug: true } },
          user:    { select: { name: true, email: true, phone: true } },
          documents: { select: { fileUrl: true, fileType: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('[admin/orders GET]', error);
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}
