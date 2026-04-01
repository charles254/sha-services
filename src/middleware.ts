import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
