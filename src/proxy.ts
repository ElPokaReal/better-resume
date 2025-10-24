import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  
  // Rutas de autenticación (login, signup)
  const authRoutes = ['/login', '/signup'];
  
  // Obtener el token de sesión de las cookies
  const sessionToken = request.cookies.get('better-auth.session_token');
  
  // Si el usuario está autenticado y trata de acceder a login/signup, redirigir al dashboard
  if (sessionToken && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Si el usuario NO está autenticado y trata de acceder a rutas protegidas, redirigir al login
  if (!sessionToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
