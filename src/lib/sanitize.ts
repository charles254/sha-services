/**
 * Input sanitization utilities to prevent injection attacks.
 */

/** Escape HTML special characters to prevent XSS in email templates */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strip control characters and newlines to prevent SMS/header injection */
export function sanitizePlainText(str: string): string {
  return str.replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').trim();
}

/** Validate and sanitize a Kenyan phone number. Returns null if invalid. */
export function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Must be a valid Kenyan number: 07/01/+254
  if (/^(?:\+?254|0)[17]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/** Validate email format */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Validate that a string looks like a UUID (tracking IDs) */
export function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/** Validate a URL is an expected S3/allowed domain or data URL */
export function isAllowedDocUrl(url: string): boolean {
  if (url.startsWith('data:')) return true; // dev mode base64
  try {
    const parsed = new URL(url);
    const bucket = process.env.AWS_BUCKET_NAME || 'sha-documents';
    // Only allow our S3 bucket URLs
    return parsed.hostname.endsWith('.amazonaws.com') && parsed.pathname.includes(bucket);
  } catch {
    return false;
  }
}

/** Mask PII for logging (show first 3 and last 2 chars) */
export function maskPII(value: string): string {
  if (value.length <= 5) return '***';
  return value.slice(0, 3) + '***' + value.slice(-2);
}
