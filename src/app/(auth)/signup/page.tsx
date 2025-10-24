import { SignUpForm } from '@/app/components/auth/signup-form';
import { ViewTransitionLink } from '@/components/view-transition-link';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center">
          <ViewTransitionLink href="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-all duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Better Resume</span>
          </ViewTransitionLink>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crea tu cuenta
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <ViewTransitionLink href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                Inicia sesión
              </ViewTransitionLink>
            </p>
          </div>
        </div>

        {/* Form */}
        <div data-view-transition="auth-form">
          <SignUpForm />
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
