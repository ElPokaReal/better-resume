import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// Crear middleware de i18n
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/editor'];
  
  // Rutas de autenticación (login, signup)
  const authRoutes = ['/login', '/signup'];
  
  // Obtener el token de sesión de las cookies
  const sessionToken = request.cookies.get('better-auth.session_token');
  
  // Remover el locale del pathname para verificar rutas
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';
  
  // Si el usuario está autenticado y trata de acceder a login/signup, redirigir al dashboard
  if (sessionToken && authRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }
  
  // Si el usuario NO está autenticado y trata de acceder a rutas protegidas, redirigir al login
  if (!sessionToken && protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  
  // Aplicar middleware de i18n
  return intlMiddleware(request);
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
