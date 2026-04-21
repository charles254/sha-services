import prisma from '@/lib/prisma';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail';
import { sendSMS, SMS_TEMPLATES }     from '@/lib/sms';

// Shared service definitions — auto-created in DB if missing
export const SHA_SERVICES: Record<string, { slug: string; name: string; description: string; price: number }> = {
  'change-phone': {
    slug: 'sha-change-phone',
    name: 'SHA Phone Number Change',
    description: 'Update your registered SHA/NHIF phone number securely via certified agents.',
    price: 200,
  },
  'pin-registration': {
    slug: 'sha-pin-registration',
    name: 'SHA PIN Registration',
    description: 'Register as a new SHA member and receive your official member number.',
    price: 300,
  },
  'contribution-statement': {
    slug: 'sha-contribution-statement',
    name: 'SHA Contribution Statement',
    description: 'Get your official SHA contribution history and payment records.',
    price: 200,
  },
  'beneficiary-update': {
    slug: 'sha-beneficiary-update',
    name: 'SHA Beneficiary Update',
    description: 'Add, remove or update your SHA dependants and beneficiaries.',
    price: 400,
  },
  'employer-registration': {
    slug: 'sha-employer-registration',
    name: 'SHA Employer Registration',
    description: 'Register your business as an SHA employer and comply with mandatory health coverage.',
    price: 800,
  },
};

/**
 * Creates a user (or finds existing), finds/creates the service, creates an order and documents.
 * Fires ORDER_RECEIVED email + SMS notification immediately after order creation.
 * Returns the created order (with service + documents included).
 */
export async function createShaOrder({
  serviceKey,
  name,
  email,
  phone,
  notes,
  documents = [],
}: {
  serviceKey: keyof typeof SHA_SERVICES;
  name: string;
  email: string;
  phone: string;
  notes: Record<string, unknown>;
  documents?: { fileUrl: string; fileType: string }[];
}) {
  const serviceDef = SHA_SERVICES[serviceKey];
  if (!serviceDef) throw new Error(`Unknown service key: ${serviceKey}`);

  // 1. Find or create user — do NOT overwrite existing user's name/phone via upsert
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { name, email, phone },
    });
  }

  // 2. Ensure service exists
  const service = await prisma.service.upsert({
    where:  { slug: serviceDef.slug },
    create: {
      slug:        serviceDef.slug,
      name:        serviceDef.name,
      description: serviceDef.description,
      price:       serviceDef.price,
    },
    update: {},
  });

  // 3. Create the Order with nested documents
  const order = await prisma.order.create({
    data: {
      userId:     user.id,
      serviceId:  service.id,
      finalPrice: serviceDef.price,
      notes:      JSON.stringify(notes),
      documents:  documents.length > 0
        ? { create: documents.map((d) => ({ fileUrl: d.fileUrl, fileType: d.fileType })) }
        : undefined,
    },
    include: { service: true, documents: true },
  });

  // 4. Fire-and-forget ORDER_RECEIVED notifications (email + SMS)
  Promise.allSettled([
    sendEmail(
      email,
      `Request Received - ${serviceDef.name}`,
      EMAIL_TEMPLATES.ORDER_RECEIVED(name, order.id, serviceDef.name, serviceDef.price)
    ),
    sendSMS(
      phone,
      SMS_TEMPLATES.ORDER_RECEIVED(order.id, serviceDef.name, serviceDef.price)
    ),
  ]).catch(() => {});

  return order;
}
