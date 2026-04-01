import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  // Rate limit: 5 attempts per 15 minutes per IP
  const rl = checkRateLimit(`login:${ip}`, { max: 5, windowSec: 15 * 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${rl.retryAfterSec} seconds.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const { password } = await req.json();

    // Require ADMIN_PASSWORD to be set in env — no hardcoded fallback
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
      console.error('[admin/login] ADMIN_PASSWORD env var is not set.');
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    // Create signed token
    const { token, cookieName, maxAge } = await createAdminToken();

    const res = NextResponse.json({ success: true });
    res.cookies.set(cookieName, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
