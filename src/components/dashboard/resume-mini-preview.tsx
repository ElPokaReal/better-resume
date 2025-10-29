'use client';

import { EditorPreview } from '@/components/editor/editor-preview';
import type { Resume } from '@/types/resume';

interface ResumeMiniPreviewProps {
  resume: Partial<Resume>;
}

export function ResumeMiniPreview({ resume }: ResumeMiniPreviewProps) {
  // Crear un resume completo con valores por defecto
  const fullResume: Resume = {
    id: resume.id || '',
    userId: resume.userId || '',
    title: resume.title || '',
    slug: resume.slug || '',
    templateId: resume.templateId || 'modern',
    personalInfo: resume.personalInfo || {
      fullName: '',
      email: '',
    },
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    languages: resume.languages || [],
    customSections: resume.customSections || [],
    design: resume.design || {
      layout: 'single-column',
      colorScheme: 'blue',
      fontFamily: 'Inter',
      fontSize: 11,
      spacing: 'normal',
    },
    sectionVisibility: resume.sectionVisibility || {
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
    },
    isPublic: resume.isPublic || false,
    isFavorite: resume.isFavorite || false,
    viewCount: resume.viewCount || 0,
    downloadCount: resume.downloadCount || 0,
    createdAt: resume.createdAt || new Date(),
    updatedAt: resume.updatedAt || new Date(),
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Escalar el preview real con mejor ajuste */}
      <div 
        className="absolute top-0 left-0"
        style={{
          transform: 'scale(0.165)',
          transformOrigin: 'top left',
          width: '606%',
          height: '606%',
        }}
      >
        <div className="w-[210mm] h-[297mm] bg-white">
          <EditorPreview
            resume={fullResume}
            previewMode="desktop"
            isExpanded={false}
          />
        </div>
      </div>
    </div>
  );
}
