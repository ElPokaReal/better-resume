'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { ScrollToTop } from '@/components/scroll-to-top';
import { AvatarCircles } from '@/components/ui/avatar-circles';
import { useTranslations } from 'next-intl';

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

export default function Home() {
  const t = useTranslations('landing');
  
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="group-hover:scale-110 transition-transform">
                <Logo size={28} />
              </div>
              <span className="text-base font-medium">Better Resume</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-black dark:bg-white text-white dark:text-black px-3.5 py-1.5 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-medium mb-6 leading-[1.1] tracking-tight">
            {t('hero.title')}
            <br />
            {t('hero.titleHighlight')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            {t('hero.users')}
          </p>
          
          {/* Avatar Circles */}
          <div className="flex justify-center mb-12">
            <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
          </div>
        </div>
      </section>

      {/* Feature 1 - Plantillas Profesionales */}
      <section className="py-20 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-medium mb-4">
                {t('features.section1.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {t('features.section1.description')}
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('features.section1.link')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
              <div className="relative bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/10 rounded-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-white/20 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-2 bg-gray-100 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-white/10 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-100 dark:bg-white/10 rounded w-4/6"></div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="h-3 bg-gray-200 dark:bg-white/15 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Editor Rápido */}
      <section className="py-20 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
                <div className="relative bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/10 rounded-xl p-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t('features.section2.badge')}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-white/15 rounded w-2/3"></div>
                      <div className="h-8 bg-gray-100 dark:bg-white/10 rounded w-full"></div>
                      <div className="h-8 bg-gray-100 dark:bg-white/10 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-100 dark:bg-white/10 rounded w-4/6"></div>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <div className="h-8 bg-blue-500/20 rounded flex-1"></div>
                      <div className="h-8 bg-gray-100 dark:bg-white/10 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-medium mb-4">
                {t('features.section2.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {t('features.section2.description')}
              </p>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('features.section2.link')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 - Exportación */}
      <section className="py-20 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-medium mb-4">
                {t('features.section3.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {t('features.section3.description')}
              </p>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('features.section3.link')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"></div>
              <div className="relative bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/10 rounded-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('features.section3.filename')}</div>
                    <div className="text-xs text-green-500">✓ {t('features.section3.ready')}</div>
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-lg mx-auto"></div>
                      <div className="text-xs text-gray-500">{t('features.section3.preview')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 bg-blue-500/20 rounded flex-1 flex items-center justify-center text-sm text-blue-600 dark:text-blue-400">
                      {t('features.section3.download')}
                    </div>
                    <div className="h-9 bg-gray-100 dark:bg-white/10 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-medium mb-6 tracking-tight">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
          >
            {t('cta.button')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>Better Resume</div>
            <div>© {new Date().getFullYear()} Better Resume</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
