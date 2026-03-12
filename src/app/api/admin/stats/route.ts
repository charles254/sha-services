import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stats — dashboard summary counts
export async function GET(req: NextRequest) {
  // Simple auth check
  if (!req.cookies.get('sha_admin_authenticated')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [total, pending, paid, processing, completed, rejected, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'REJECTED' } }),
      prisma.order.aggregate({
        where:   { status: { in: ['PAID', 'PROCESSING', 'COMPLETED'] } },
        _sum:    { finalPrice: true },
      }),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = await prisma.order.count({ where: { createdAt: { gte: todayStart } } });

    return NextResponse.json({
      total, pending, paid, processing, completed, rejected,
      revenue: revenue._sum.finalPrice || 0,
      todayOrders,
    });
  } catch (error) {
    console.error('[admin/stats]', error);
    return NextResponse.json({ error: 'Failed to load stats.' }, { status: 500 });
  }
}
