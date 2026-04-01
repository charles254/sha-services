import axios from 'axios';
import { sanitizePlainText } from '@/lib/sanitize';

const AT_USERNAME  = process.env.AT_USERNAME  || 'sandbox';
const AT_API_KEY   = process.env.AT_API_KEY;
const AT_SENDER_ID = process.env.AT_SENDER_ID;

function formatPhone(phone: string): string {
  let p = phone.replace(/[^0-9]/g, '');
  if (p.startsWith('0'))    p = '+254' + p.slice(1);
  else if (!p.startsWith('+')) p = '+254' + p;
  return p;
}

export async function sendSMS(to: string, message: string): Promise<{ success: boolean }> {
  const phone = formatPhone(to);

  if (!AT_API_KEY || !AT_API_KEY.startsWith('atsk_')) {
    console.warn(`[sms] AT_API_KEY not set — SMS not sent.`);
    return { success: true };
  }

  const params = new URLSearchParams({
    username: AT_USERNAME,
    to:       phone,
    message,
    ...(AT_SENDER_ID ? { from: AT_SENDER_ID } : {}),
  });

  try {
    await axios.post('https://api.africastalking.com/version1/messaging', params, {
      headers: {
        apiKey:         AT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept:         'application/json',
      },
    });
    return { success: true };
  } catch (err: unknown) {
    console.error('[sms] Send failed:', err);
    return { success: false };
  }
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const SMS_TEMPLATES = {
  ORDER_RECEIVED: (orderId: string, service: string, amount: number) =>
    `SHA Services: Your request for ${sanitizePlainText(service)} (Ksh ${amount}) has been received. Check your phone for M-Pesa prompt. Tracking ID: ${orderId.slice(0, 8)}`,

  PAYMENT_CONFIRMED: (orderId: string, receipt: string) =>
    `SHA Services: Payment confirmed (Receipt: ${sanitizePlainText(receipt)}). Your request is now being processed by a certified agent. Track: ${BASE}/track?id=${encodeURIComponent(orderId)}`,

  ORDER_COMPLETED: (orderId: string, name: string, service: string) =>
    `Habari ${sanitizePlainText(name)}! Your SHA ${sanitizePlainText(service)} request is COMPLETE. Tracking: ${orderId.slice(0, 8)}. Track at: ${BASE}/track?id=${encodeURIComponent(orderId)}`,

  ORDER_REJECTED: (orderId: string, reason: string) =>
    `SHA Services: Your request ${orderId.slice(0, 8)} could not be processed. Reason: ${sanitizePlainText(reason)}. Please contact support.`,
};
