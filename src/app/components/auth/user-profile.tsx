'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">No has iniciado sesión</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mb-4">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {session.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">{session.user.name}</h2>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Email verificado:</span>{' '}
          {session.user.emailVerified ? '✓ Sí' : '✗ No'}
        </p>
        <p>
          <span className="font-semibold">ID:</span> {session.user.id}
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
