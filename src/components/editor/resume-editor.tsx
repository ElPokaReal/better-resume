'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { EditorSidebar } from './editor-sidebar';
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
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

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
    try {
      // TODO: Implement save to database
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Auto-saving resume:', resume);
      toast.success('CV guardado exitosamente', {
        description: 'Todos tus cambios han sido guardados',
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Error al guardar', {
        description: 'No se pudo guardar el CV. Intenta de nuevo.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Toolbar */}
      <EditorToolbar
        resume={resume}
        isSaving={isSaving}
        previewMode={previewMode}
        onSave={handleSave}
        onPreviewModeChange={setPreviewMode}
        isPreviewExpanded={isPreviewExpanded}
        onTogglePreviewExpanded={() => setIsPreviewExpanded(!isPreviewExpanded)}
        onTitleChange={handleTitleChange}
      />

      {/* Main Editor Layout - 3 Columns */}
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-900">
        {/* Left Sidebar - Section Navigation (80px) */}
        {!isPreviewExpanded && (
          <EditorSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}

        {/* Center Panel - Forms (flex-1) */}
        {!isPreviewExpanded && (
          <EditorFormPanel
            activeSection={activeSection}
            resume={resume}
            onResumeUpdate={handleResumeUpdate}
          />
        )}

        {/* Right Panel - Live Preview (600px fixed) */}
        <EditorPreview 
          resume={resume} 
          previewMode={previewMode}
          isExpanded={isPreviewExpanded}
        />
      </div>
    </div>
  );
}
