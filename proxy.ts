import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  
  // If attempting to access /admin pages without a session cookie, redirect to /login
  if (request.nextUrl.pathname.startsWith('/admin') && !session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If logged in and trying to go to /login, redirect to /admin
  if (request.nextUrl.pathname.startsWith('/login') && session) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
