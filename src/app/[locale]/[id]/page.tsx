'use client';

import { notFound } from 'next/navigation';
import { getResumeByIdForPreview } from '@/app/actions/resume';
import { EditorPreview } from '@/components/editor/editor-preview';
import { ArrowLeft } from 'lucide-react';
import type { Resume } from '@/types/resume';
import { use, useEffect, useState } from 'react';

interface PreviewPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const [resumeData, setResumeData] = useState<Awaited<ReturnType<typeof getResumeByIdForPreview>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await getResumeByIdForPreview(id);
        if (!data) {
          notFound();
        }
        setResumeData(data);
      } catch (err) {
        console.error('Error loading resume:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Database Connection Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to connect to the database. The database might be paused or experiencing connectivity issues.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            If you&apos;re using Neon&apos;s free tier, the database may have been paused due to inactivity. 
            Please wait a moment and try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    notFound();
  }

  // Convertir los datos de la BD al tipo Resume esperado
  const resume: Resume = {
    id: resumeData.id,
    userId: resumeData.userId,
    title: resumeData.title,
    slug: resumeData.slug,
    templateId: resumeData.templateId,
    personalInfo: resumeData.personalInfo || {
      fullName: '',
      email: '',
    },
    experience: resumeData.experience || [],
    education: resumeData.education || [],
    skills: resumeData.skills || [],
    projects: resumeData.projects || [],
    certifications: resumeData.certifications || [],
    languages: resumeData.languages || [],
    customSections: resumeData.customSections || [],
    sectionVisibility: resumeData.sectionVisibility || {
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
    },
    design: resumeData.design || {
      layout: 'single-column',
      colorScheme: 'blue',
      fontFamily: 'Inter',
      fontSize: 11,
      spacing: 'normal',
    },
    isPublic: resumeData.isPublic || false,
    viewCount: resumeData.viewCount || 0,
    downloadCount: resumeData.downloadCount || 0,
    createdAt: resumeData.createdAt,
    updatedAt: resumeData.updatedAt,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
              </a>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {resume.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vista previa del currículum
                </p>
              </div>
            </div>
            
            <a
              href={`/editor/${id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Editar
            </a>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <EditorPreview
            resume={resume}
            previewMode="desktop"
            isExpanded={false}
          />
        </div>
      </main>
    </div>
  );
}
