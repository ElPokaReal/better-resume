import { notFound } from 'next/navigation';
import { getRequestConfig} from 'next-intl/server';

// Idiomas soportados
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ requestLocale }) => {
  // Obtener el locale de la solicitud
  let locale = await requestLocale;

  // Validar que el locale sea soportado
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
