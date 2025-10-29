'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ResumeEditor } from '@/components/editor/resume-editor';
import { getResumeById } from '@/app/actions/resume';
import { useTranslations } from 'next-intl';
import type { Resume } from '@/types/resume';

export default function EditorPage() {
  const params = useParams();
  const resumeId = params.id as string;
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('editor');

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await getResumeById(resumeId);
        if (data) {
          setResume(data as Resume);
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      } finally {
        setLoading(false);
      }
    }

    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('notFound')}</p>
        </div>
      </div>
    );
  }

  return <ResumeEditor initialResume={resume} />;
}
