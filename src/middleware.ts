// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const PUBLIC_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/dashboard', '/employee'];
import { handleMe } from '@/app/login/serverAction/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const validateToken = token ? await handleMe(token) : false
    if (!validateToken) request.cookies.delete('token');
        
    // Skip middleware for API routes and static files
    if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Case 1: User has token but tries to access public routes
    if (validateToken && PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Case 2: User has no token but tries to access protected routes
    if (!validateToken && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};