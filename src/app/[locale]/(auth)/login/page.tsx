import { LoginForm } from '@/app/components/auth/login-form';
import { ViewTransitionLink } from '@/components/view-transition-link';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center">
          <ViewTransitionLink href="/" className="flex items-center gap-2 mb-8 group">
            <div className="group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-all duration-200">
              <Logo size={40} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Better Resume</span>
          </ViewTransitionLink>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <ViewTransitionLink href="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                Regístrate gratis
              </ViewTransitionLink>
            </p>
          </div>
        </div>

        {/* Form */}
        <div data-view-transition="auth-form">
          <LoginForm />
        </div>

        {/* Back to home */}
        <div className="text-center">
          <ViewTransitionLink 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Volver al inicio
          </ViewTransitionLink>
        </div>
      </div>
    </div>
  );
}
