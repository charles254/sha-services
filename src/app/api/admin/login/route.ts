import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN = 'sha_admin_authenticated';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sha-admin-2024';

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_TOKEN, 'true', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('sha_admin_authenticated');
  return res;
}
