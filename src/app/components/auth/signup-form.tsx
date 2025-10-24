'use client';

import { useState } from 'react';
import { signUp, signInWithGitHub } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Github, Mail, Lock, User, Loader2, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter();

  // Password strength validation
  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp.email({
        name,
        email,
        password,
      }, {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Error al registrarse');
        },
      });
    } catch (err) {
      setError('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    try {
      await signInWithGitHub();
    } catch (err) {
      setError('Error al registrarse con GitHub');
      setGithubLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-6">
        
        {/* GitHub Sign Up Button */}
        <button
          type="button"
          onClick={handleGitHubSignIn}
          disabled={githubLoading || loading}
          className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-black px-6 py-3.5 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {githubLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          )}
          <span>Continuar con GitHub</span>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 font-medium">
              O regístrate con email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Nombre completo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Correo electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="nombre@ejemplo.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="Crea una contraseña segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicators */}
            {password && (
              <div className="space-y-2 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Tu contraseña debe tener:
                </p>
                <div className="space-y-1.5">
                  <PasswordRequirement
                    met={passwordStrength.hasMinLength}
                    text="Al menos 8 caracteres"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasUpperCase}
                    text="Una letra mayúscula"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasLowerCase}
                    text="Una letra minúscula"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasNumber}
                    text="Un número"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-red-500 text-lg leading-none">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || githubLoading || !isPasswordValid}
            className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>Crear Cuenta</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper component for password requirements
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
        met ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}>
        {met && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className={`transition-colors ${
        met ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {text}
      </span>
    </div>
  );
}
