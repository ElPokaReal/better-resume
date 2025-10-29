'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include', // Importante: incluir cookies en requests
  },
});

// Exportar hooks y métodos útiles
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
} = authClient;

// Función helper para GitHub OAuth
export const signInWithGitHub = async () => {
  await signIn.social({
    provider: 'github',
    callbackURL: '/en/dashboard',
  });
};

// Función helper para Google OAuth
export const signInWithGoogle = async () => {
  await signIn.social({
    provider: 'google',
    callbackURL: '/en/dashboard',
  });
};
