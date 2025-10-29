'use client';

import { FileText, Plus, Star, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EmptyStateProps {
  onCreateNew: () => void;
  filterType?: 'all' | 'favorites' | 'recent';
}

export function EmptyState({ onCreateNew, filterType = 'all' }: EmptyStateProps) {
  const t = useTranslations('dashboard');
  
  // Configuración según el tipo de filtro
  const config = {
    all: {
      icon: FileText,
      title: t('empty'),
      description: t('emptyDescription'),
      showButton: true,
      showFeatures: true,
    },
    favorites: {
      icon: Star,
      title: t('emptyFavorites'),
      description: t('emptyFavoritesDescription'),
      showButton: false,
      showFeatures: false,
    },
    recent: {
      icon: Clock,
      title: t('emptyRecent'),
      description: t('emptyRecentDescription'),
      showButton: false,
      showFeatures: false,
    },
  };
  
  const { icon: Icon, title, description, showButton, showFeatures } = config[filterType];
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Icon className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        {description}
      </p>
      
      {showButton && (
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          {t('emptyButton')}
        </button>
      )}
      
      {/* Feature hints */}
      {showFeatures && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('emptyFeatures.fast')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('emptyFeatures.customizable')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('emptyFeatures.pdf')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
