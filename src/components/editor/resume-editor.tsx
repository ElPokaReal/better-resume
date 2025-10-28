'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { EditorTabs } from './editor-tabs';
import { EditorPreview } from './editor-preview';
import { EditorToolbar } from './editor-toolbar';
import { EditorFormPanel } from './editor-form-panel';
import type { Resume, EditorSection } from '@/types/resume';

interface ResumeEditorProps {
  initialResume: Resume;
}

export function ResumeEditor({ initialResume }: ResumeEditorProps) {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [activeSection, setActiveSection] = useState<EditorSection>('personal-info');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Calcular progreso y secciones completadas
  const calculateProgress = (): { progress: number; completedSections: EditorSection[] } => {
    const completed: EditorSection[] = [];
    
    // Personal Info (required fields)
    if (resume.personalInfo?.fullName && resume.personalInfo?.email) {
      completed.push('personal-info');
    }
    
    // Experience
    if (resume.experience && resume.experience.length > 0) {
      completed.push('experience');
    }
    
    // Education
    if (resume.education && resume.education.length > 0) {
      completed.push('education');
    }
    
    // Skills
    if (resume.skills && resume.skills.length > 0) {
      completed.push('skills');
    }
    
    // Projects
    if (resume.projects && resume.projects.length > 0) {
      completed.push('projects');
    }
    
    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      completed.push('certifications');
    }
    
    // Languages
    if (resume.languages && resume.languages.length > 0) {
      completed.push('languages');
    }
    
    // Design (always completed if accessed)
    if (resume.design) {
      completed.push('design');
    }
    
    const progress = (completed.length / 8) * 100;
    return { progress, completedSections: completed };
  };

  const { progress, completedSections } = calculateProgress();

  // Auto-save cuando cambia el resume
  useEffect(() => {
    // Limpiar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Crear nuevo timeout para auto-guardar después de 2 segundos
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resume]);

  const handleResumeUpdate = (updates: Partial<Resume>) => {
    setResume((prev) => ({ ...prev, ...updates, updatedAt: new Date() }));
  };

  const handleTitleChange = (title: string) => {
    setResume((prev) => ({ ...prev, title, updatedAt: new Date() }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const { updateResume } = await import('@/app/actions/resume');
      
      await updateResume(resume.id, {
        title: resume.title,
        personalInfo: resume.personalInfo,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications,
        languages: resume.languages,
        customSections: resume.customSections,
        design: resume.design,
        sectionVisibility: resume.sectionVisibility,
      });
      
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
      toast.error('Error al guardar', {
        description: 'No se pudo guardar el CV. Intenta de nuevo.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0">
        <EditorToolbar
          resume={resume}
          isSaving={isSaving}
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          progress={progress}
          previewMode={previewMode}
          onSave={handleSave}
          onPreviewModeChange={setPreviewMode}
          isPreviewExpanded={isPreviewExpanded}
          onTogglePreviewExpanded={() => setIsPreviewExpanded(!isPreviewExpanded)}
          onTitleChange={handleTitleChange}
        />
      </div>

      {/* Main Editor Layout */}
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-900">
        {/* Desktop: 3 Columns Layout */}
        {/* Mobile: Single View with Toggle */}
        
        {/* Left Sidebar - Tabs Navigation (Desktop only) */}
        {!isPreviewExpanded && (
          <div className="hidden lg:block w-[280px] shrink-0">
            <EditorTabs
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              completedSections={completedSections}
              progress={progress}
            />
          </div>
        )}

        {/* Center Panel - Forms */}
        {!isPreviewExpanded && !showPreview && (
          <div className="flex-1 overflow-auto lg:block">
            <EditorFormPanel
              activeSection={activeSection}
              resume={resume}
              onResumeUpdate={handleResumeUpdate}
            />
          </div>
        )}

        {/* Desktop Preview - Always visible on desktop */}
        {!isPreviewExpanded && (
          <div className="hidden lg:block lg:w-[600px] shrink-0">
            <EditorPreview 
              resume={resume} 
              previewMode={previewMode}
              isExpanded={false}
            />
          </div>
        )}

        {/* Mobile Preview - Only when showPreview is true */}
        {showPreview && !isPreviewExpanded && (
          <div className="flex-1 lg:hidden overflow-auto">
            <EditorPreview 
              resume={resume} 
              previewMode="mobile"
              isExpanded={false}
            />
          </div>
        )}

        {/* Expanded Preview - Fullscreen */}
        {isPreviewExpanded && (
          <div className="w-full overflow-auto">
            <EditorPreview 
              resume={resume} 
              previewMode={previewMode}
              isExpanded={true}
            />
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-around p-2">
          {/* Form/Edit Button */}
          <button
            onClick={() => setShowPreview(false)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              !showPreview 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs font-medium">Editar</span>
          </button>

          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>

        {/* Mobile Tabs - Horizontal Scroll */}
        {!showPreview && (
          <div className="overflow-x-auto border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-1 p-2 min-w-max">
              {[
                { id: 'personal-info', icon: '👤', label: 'Personal' },
                { id: 'experience', icon: '💼', label: 'Experiencia' },
                { id: 'education', icon: '🎓', label: 'Educación' },
                { id: 'skills', icon: '💻', label: 'Habilidades' },
                { id: 'projects', icon: '📁', label: 'Proyectos' },
                { id: 'certifications', icon: '🏆', label: 'Certificaciones' },
                { id: 'languages', icon: '🌐', label: 'Idiomas' },
                { id: 'design', icon: '🎨', label: 'Diseño' },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as EditorSection)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                  {completedSections.includes(section.id as EditorSection) && (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
