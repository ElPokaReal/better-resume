import { auth } from '@/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  try {
    const response = await handlers.GET(request);
    
    // Log para debugging
    if (request.nextUrl.pathname.includes('/callback/')) {
      console.log('[Auth] OAuth callback response:', {
        status: response.status,
        location: response.headers.get('location'),
        cookies: response.headers.get('set-cookie'),
      });
    }
    
    return response;
  } catch (error) {
    console.error('[Auth GET Error]:', error);
    
    // Si es un callback de OAuth, redirigir con error
    if (request.nextUrl.pathname.includes('/callback/')) {
      const errorUrl = new URL('/login', request.url);
      errorUrl.searchParams.set('error', 'oauth_callback_failed');
      errorUrl.searchParams.set('message', 'Database connection error. Please try again.');
      return NextResponse.redirect(errorUrl);
    }
    
    return NextResponse.json(
      { error: 'Authentication error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    console.error('[Auth POST Error]:', error);
    return NextResponse.json(
      { error: 'Authentication error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
