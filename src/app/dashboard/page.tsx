'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { ResumeCard } from '@/components/dashboard/resume-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Plus, Search, Grid3x3, List } from 'lucide-react';
import { getUserResumes, createResume } from '@/app/actions/resume';
import { useRouter } from 'next/navigation';

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: Date;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hace unos segundos';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 604800)} semanas`;
  return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await getUserResumes();
        setResumes(data as Resume[]);
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadResumes();
  }, []);

  const handleCreateNew = async () => {
    setCreating(true);
    try {
      const newResume = await createResume('Nuevo Currículum');
      router.push(`/editor/${newResume.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      setCreating(false);
    }
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Mis Currículums
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona y edita tus currículums profesionales
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar currículums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Create New Button */}
          <button
            onClick={handleCreateNew}
            disabled={creating}
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none transition-all duration-200 whitespace-nowrap"
          >
            {creating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Creando...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Currículum</span>
                <span className="sm:hidden">Nuevo</span>
              </>
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando currículums...</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron currículums que coincidan con "{searchQuery}"
              </p>
            </div>
          ) : (
            <EmptyState onCreateNew={handleCreateNew} />
          )
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredResumes.map((resume) => (
              <ResumeCard 
                key={resume.id}
                id={resume.id}
                title={resume.title}
                template={resume.templateId}
                updatedAt={formatRelativeTime(resume.updatedAt)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

