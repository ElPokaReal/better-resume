'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { ResumeCard } from '@/components/dashboard/resume-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Plus, Search, Grid3x3, List, Star, Clock, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getUserResumes, createResume } from '@/app/actions/resume';
import { useRouter } from 'next/navigation';
import { DashboardProvider } from '@/contexts/dashboard-context';
import { useTranslations, useLocale } from 'next-intl';

import type { Resume } from '@/types/resume';

function formatRelativeTime(date: Date, locale: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const isSpanish = locale === 'es';
  
  if (diffInSeconds < 60) return isSpanish ? 'hace unos segundos' : 'a few seconds ago';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return isSpanish ? `hace ${minutes} minutos` : `${minutes} minutes ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return isSpanish ? `hace ${hours} horas` : `${hours} hours ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return isSpanish ? `hace ${days} días` : `${days} days ago`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return isSpanish ? `hace ${weeks} semanas` : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffInSeconds / 2592000);
  return isSpanish ? `hace ${months} meses` : `${months} months ago`;
}

function formatDate(date: Date | undefined | null, locale: string): string {
  if (!date) return '-';
  
  // Convertir a Date si es string
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar si es una fecha válida
  if (isNaN(dateObj.getTime())) return '-';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return dateObj.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', options);
}

type FilterType = 'all' | 'favorites' | 'recent';
type SortType = 'updated' | 'created' | 'title';

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('updated');
  const [showFilters, setShowFilters] = useState(false);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await getUserResumes();
      setResumes(data as Resume[]);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreateNew = async () => {
    setCreating(true);
    try {
      const newResume = await createResume(t('createNew'));
      router.push(`/editor/${newResume.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      setCreating(false);
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter(resume => {
      // Search filter
      const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      if (filter === 'favorites') return matchesSearch && resume.isFavorite;
      if (filter === 'recent') {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return matchesSearch && new Date(resume.updatedAt) > dayAgo;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const favoriteCount = resumes.filter(r => r.isFavorite).length;
  const recentCount = resumes.filter(r => {
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return new Date(r.updatedAt) > dayAgo;
  }).length;

  return (
    <DashboardProvider refreshResumes={loadResumes}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('subtitle', { count: resumes.length, favorites: favoriteCount })}
              </p>
            </div>
            
            {/* Create New Button - Desktop */}
            <button
              onClick={handleCreateNew}
              disabled={creating}
              className="hidden sm:flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none transition-all duration-200"
            >
              {creating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('creating')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>{t('createNew')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4 mb-6 sm:mb-8">
          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
              }`}
            >
              <span>{t('filters.all')}</span>
              <span className="text-xs opacity-75">({resumes.length})</span>
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === 'favorites'
                  ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500'
              }`}
            >
              <Star className={`w-4 h-4 ${filter === 'favorites' ? 'fill-current' : ''}`} />
              <span>{t('filters.favorites')}</span>
              <span className="text-xs opacity-75">({favoriteCount})</span>
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === 'recent'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t('filters.recent')}</span>
              <span className="text-xs opacity-75">({recentCount})</span>
            </button>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">{t('sort.label')}</span>
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
                  <button
                    onClick={() => { setSortBy('updated'); setShowFilters(false); }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl ${
                      sortBy === 'updated' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('sort.updated')}
                  </button>
                  <button
                    onClick={() => { setSortBy('created'); setShowFilters(false); }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      sortBy === 'created' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('sort.created')}
                  </button>
                  <button
                    onClick={() => { setSortBy('title'); setShowFilters(false); }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors last:rounded-b-xl ${
                      sortBy === 'title' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('sort.title')}
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={t('viewMode.grid')}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={t('viewMode.list')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon - Templates Section */}
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'es' ? 'Plantillas Profesionales - Próximamente' : 'Professional Templates - Coming Soon'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {locale === 'es' 
                  ? 'Estamos trabajando en una colección de plantillas profesionales para que puedas crear CVs impresionantes en minutos. ¡Mantente atento!' 
                  : 'We are working on a collection of professional templates so you can create stunning resumes in minutes. Stay tuned!'}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{t('loading')}</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                {t('noResults', { query: searchQuery })}
              </p>
            </div>
          ) : (
            <EmptyState onCreateNew={handleCreateNew} filterType={filter} />
          )
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6'
                  : 'space-y-3 sm:space-y-4'
              }
            >
              {filteredResumes.map((resumeItem) => (
                <ResumeCard 
                  key={resumeItem.id}
                  id={resumeItem.id}
                  title={resumeItem.title}
                  template={resumeItem.templateId}
                  updatedAt={formatRelativeTime(resumeItem.updatedAt, locale)}
                  createdAt={formatDate(resumeItem.createdAt, locale)}
                  design={resumeItem.design}
                  isPublic={resumeItem.isPublic}
                  isFavorite={resumeItem.isFavorite}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {/* Mobile FAB */}
            <button
              onClick={handleCreateNew}
              disabled={creating}
              className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 disabled:scale-100 transition-all duration-200 flex items-center justify-center"
            >
              {creating ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </button>
          </>
        )}
      </main>
    </div>
    </DashboardProvider>
  );
}

