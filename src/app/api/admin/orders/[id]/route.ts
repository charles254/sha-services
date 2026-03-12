import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail';
import { sendSMS, SMS_TEMPLATES } from '@/lib/sms';

// GET /api/admin/orders/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!req.cookies.get('sha_admin_authenticated')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        service:   true,
        user:      true,
        documents: true,
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('[admin/orders/[id] GET]', error);
    return NextResponse.json({ error: 'Failed to fetch order.' }, { status: 500 });
  }
}

// PATCH /api/admin/orders/[id]  — update status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!req.cookies.get('sha_admin_authenticated')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const { status, notes: agentNotes, documents } = await req.json();

    const VALID = ['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'REJECTED'];
    if (status && !VALID.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, service: true },
    });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

    const updated = await prisma.order.update({
      where: { id },
      data:  {
        status: status || undefined,
        notes: agentNotes
          ? JSON.stringify({ ...(order.notes ? JSON.parse(order.notes) : {}), agentNotes })
          : undefined,
        documents: documents && documents.length > 0
          ? { create: documents.map((d: any) => ({ fileUrl: d.fileUrl, fileType: d.fileType })) }
          : undefined,
      },
    });

    // ── Fire status-based notifications ─────────────────────────────────
    if (status === 'COMPLETED') {
      Promise.allSettled([
        sendEmail(
          order.user.email,
          `🎉 ${order.service.name} — Completed!`,
          EMAIL_TEMPLATES.ORDER_COMPLETED(order.user.name, order.id, order.service.name)
        ),
        sendSMS(
          order.user.phone,
          SMS_TEMPLATES.ORDER_COMPLETED(order.id, order.user.name, order.service.name)
        ),
      ]).catch(() => {});
    }

    if (status === 'REJECTED' && agentNotes) {
      Promise.allSettled([
        sendSMS(order.user.phone, SMS_TEMPLATES.ORDER_REJECTED(order.id, agentNotes)),
      ]).catch(() => {});
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('[admin/orders/[id] PATCH]', error);
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
