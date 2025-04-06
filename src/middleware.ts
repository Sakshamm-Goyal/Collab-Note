import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, req) => {
  console.log('Requested URL:', req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/CLERKJS.NAVIGATE.COMPLETE' || req.nextUrl.pathname.includes('/CLERKJS.NAVIGATE')) {
    return NextResponse.redirect(new URL('/rooms', req.url));
  }

  if (
    auth().userId &&
    ['/', '/sign-in', '/sign-up'].includes(req.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL('/rooms', req.url));
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
