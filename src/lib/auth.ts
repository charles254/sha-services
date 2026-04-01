import { NextRequest } from 'next/server';

const COOKIE_NAME = 'sha_admin_token';
const TOKEN_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours in ms

function getSecret(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_TOKEN_SECRET must be set and at least 32 characters long.');
  }
  return secret;
}

/** Generate random hex string using Web Crypto API (Edge-compatible) */
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** HMAC-SHA256 sign using Web Crypto API (Edge-compatible) */
async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** HMAC-SHA256 verify using Web Crypto API (Edge-compatible) */
async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(data, secret);
  if (signature.length !== expected.length) return false;
  // Constant-time-ish comparison
  let match = true;
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== expected[i]) match = false;
  }
  return match;
}

/** Create an HMAC-signed admin token with expiry */
export async function createAdminToken(): Promise<{ token: string; cookieName: string; maxAge: number }> {
  const secret = getSecret();
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
    jti: randomHex(16),
  };

  const data = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const signature = await hmacSign(data, secret);
  const token = `${data}.${signature}`;

  return {
    token,
    cookieName: COOKIE_NAME,
    maxAge: TOKEN_EXPIRY / 1000,
  };
}

/** Verify the admin token from a cookie value. Returns true if valid. */
export async function verifyAdminToken(tokenValue: string | undefined): Promise<boolean> {
  if (!tokenValue) return false;

  try {
    const secret = getSecret();
    const parts = tokenValue.split('.');
    if (parts.length !== 2) return false;

    const [data, signature] = parts;

    const valid = await hmacVerify(data, signature, secret);
    if (!valid) return false;

    // Decode and check expiry
    const json = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    if (!payload.exp || Date.now() > payload.exp) return false;
    if (payload.role !== 'admin') return false;

    return true;
  } catch {
    return false;
  }
}

/** Check admin auth from a NextRequest (for API routes) */
export async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
