'use client';

import { forwardRef, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateEmail, validateURL, validatePhone, validateLinkedIn, validateGitHub } from '../../lib/validation';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validationType?: 'email' | 'url' | 'phone' | 'linkedin' | 'github' | 'none';
  showValidation?: boolean;
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, validationType = 'none', showValidation = true, className = '', ...props }, ref) => {
    const [value, setValue] = useState(props.value || '');

    // Calcular validación directamente sin useEffect
    const getValidationState = (): boolean | null => {
      if (!showValidation || !value || validationType === 'none') {
        return null;
      }

      switch (validationType) {
        case 'email':
          return validateEmail(value as string);
        case 'url':
          return validateURL(value as string);
        case 'phone':
          return validatePhone(value as string);
        case 'linkedin':
          return validateLinkedIn(value as string);
        case 'github':
          return validateGitHub(value as string);
        default:
          return null;
      }
    };

    const isValid = getValidationState();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            value={value}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${isValid === true ? 'border-green-500' : ''}
              ${isValid === false ? 'border-yellow-500' : ''}
              ${className}
            `}
          />
          {showValidation && value && validationType !== 'none' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid === true && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              {isValid === false && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {isValid === false && !error && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            {validationType === 'email' && 'Formato de email inválido'}
            {validationType === 'url' && 'URL inválida (debe incluir http:// o https://)'}
            {validationType === 'phone' && 'Número de teléfono inválido'}
            {validationType === 'linkedin' && 'URL de LinkedIn inválida'}
            {validationType === 'github' && 'URL de GitHub inválida'}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';
