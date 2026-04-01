import nodemailer from 'nodemailer';
import { escapeHtml } from '@/lib/sanitize';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[mail] SMTP not configured — email not sent.');
    return { success: true, status: 'logged' };
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error('[mail] Error:', err);
    return { success: false, error: err };
  }
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const EMAIL_TEMPLATES = {
  ORDER_RECEIVED: (name: string, orderId: string, service: string, amount: number) => {
    const safeName = escapeHtml(name);
    const safeService = escapeHtml(service);
    const safeOrderId = escapeHtml(orderId);
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:#164e2e;padding:28px 32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:20px;font-weight:900;">SHA Online Cyber Services</h1>
        <p style="color:#6ee7b7;margin:6px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;">Request Received</p>
      </div>
      <div style="padding:40px 32px;">
        <p style="font-size:16px;color:#374151;">Hello <strong>${safeName}</strong>,</p>
        <p style="color:#6b7280;line-height:1.7;">We have received your request for <strong style="color:#164e2e;">${safeService}</strong>. To begin processing, please complete the M-Pesa payment on your phone.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:24px 0;">
          <table style="width:100%;font-size:13px;">
            <tr><td style="color:#6b7280;padding:4px 0;text-transform:uppercase;font-size:10px;font-weight:700;">Tracking ID</td><td style="text-align:right;font-weight:900;color:#164e2e;">${safeOrderId}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;text-transform:uppercase;font-size:10px;font-weight:700;">Service</td><td style="text-align:right;font-weight:700;">${safeService}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;text-transform:uppercase;font-size:10px;font-weight:700;">Amount</td><td style="text-align:right;font-weight:900;color:#164e2e;font-size:16px;">Ksh ${amount.toLocaleString()}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:32px;">
          <a href="${BASE}/track?id=${encodeURIComponent(orderId)}" style="background:#164e2e;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:.1em;">Track My Request</a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:10px;color:#9ca3af;margin:0;text-transform:uppercase;font-weight:700;">SHA Online Cyber Services Kenya &middot; KDPA 2019 Compliant &middot; AES-256 Encrypted</p>
      </div>
    </div>`;
  },

  PAYMENT_CONFIRMED: (name: string, orderId: string, service: string, receipt: string) => {
    const safeName = escapeHtml(name);
    const safeService = escapeHtml(service);
    const safeOrderId = escapeHtml(orderId);
    const safeReceipt = escapeHtml(receipt);
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:#164e2e;padding:28px 32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:20px;font-weight:900;">Payment Confirmed</h1>
        <p style="color:#6ee7b7;margin:6px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;">SHA Online Cyber Services</p>
      </div>
      <div style="padding:40px 32px;">
        <p style="font-size:16px;color:#374151;">Hello <strong>${safeName}</strong>,</p>
        <p style="color:#6b7280;line-height:1.7;">Your M-Pesa payment for <strong>${safeService}</strong> has been confirmed. A certified SHA agent has been assigned to your request.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:24px 0;">
          <table style="width:100%;font-size:13px;">
            <tr><td style="color:#6b7280;padding:4px 0;text-transform:uppercase;font-size:10px;font-weight:700;">M-Pesa Receipt</td><td style="text-align:right;font-weight:900;color:#164e2e;">${safeReceipt}</td></tr>
            <tr><td style="color:#6b7280;padding:4px 0;text-transform:uppercase;font-size:10px;font-weight:700;">Tracking ID</td><td style="text-align:right;font-weight:700;">${safeOrderId}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:32px;">
          <a href="${BASE}/track?id=${encodeURIComponent(orderId)}" style="background:#164e2e;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:.1em;">Track My Request</a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:10px;color:#9ca3af;margin:0;text-transform:uppercase;font-weight:700;">SHA Online Cyber Services Kenya &middot; KDPA 2019 Compliant</p>
      </div>
    </div>`;
  },

  ORDER_COMPLETED: (name: string, orderId: string, service: string) => {
    const safeName = escapeHtml(name);
    const safeService = escapeHtml(service);
    const safeOrderId = escapeHtml(orderId);
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:#15803d;padding:28px 32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;font-weight:900;">Request Completed!</h1>
        <p style="color:#bbf7d0;margin:6px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;">SHA Online Cyber Services</p>
      </div>
      <div style="padding:40px 32px;">
        <p style="font-size:16px;color:#374151;">Hello <strong>${safeName}</strong>,</p>
        <p style="color:#6b7280;line-height:1.7;">Great news! Your request for <strong>${safeService}</strong> has been <strong style="color:#15803d;">successfully processed</strong>. You will receive an SMS confirmation on your registered phone number.</p>
        <p style="color:#6b7280;line-height:1.7;">Your updated SHA records are now live. You can log in to the SHA portal to verify.</p>
        <div style="text-align:center;margin-top:32px;display:flex;gap:12px;justify-content:center;">
          <a href="${BASE}/track?id=${encodeURIComponent(orderId)}" style="background:#164e2e;color:white;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:900;font-size:13px;">View Details</a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:10px;color:#9ca3af;margin:0;text-transform:uppercase;font-weight:700;">SHA Online Cyber Services Kenya &middot; KDPA 2019 Compliant</p>
      </div>
    </div>`;
  },
};
