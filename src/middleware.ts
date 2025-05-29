import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from './lib/auth';
import { env } from './env';

export async function middleware(request: NextRequest) {
  const user = await checkAuth();

  const redirectUrl = request.url.split(`${env.NEXT_PUBLIC_APP_URL}`)[1];

  if (request.nextUrl.pathname.startsWith('/dealer')) {
    if (user?.role === 'dealer') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${redirectUrl}`, request.url)
      );
    }
  }
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (user?.role === 'admin') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${redirectUrl}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/dealer/(.*)',
    '/admin/(.*)',
    '/login',
    '/register'
  ]
};
