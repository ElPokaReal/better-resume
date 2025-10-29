'use client';

import { useState, useRef, useEffect } from 'react';
import { Save, Download, Share2, Monitor, Smartphone, ArrowLeft, Maximize2, Minimize2, Check, X, Globe, Lock } from 'lucide-react';
import { ViewTransitionLink } from '@/components/view-transition-link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/resume-pdf';
import { motion } from 'framer-motion';
import { SaveIndicator } from './save-indicator';
import { toggleResumePublic } from '@/app/actions/resume';
import { useTranslations } from 'next-intl';
import type { Resume } from '@/types/resume';

interface EditorToolbarProps {
  resume: Resume;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  progress: number;
  previewMode: 'desktop' | 'mobile';
  onSave: () => void;
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  isPreviewExpanded: boolean;
  onTogglePreviewExpanded: () => void;
  onTitleChange: (title: string) => void;
}

export function EditorToolbar({
  resume,
  isSaving,
  saveStatus,
  lastSaved,
  progress,
  previewMode,
  onSave,
  onPreviewModeChange,
  isPreviewExpanded,
  onTogglePreviewExpanded,
  onTitleChange,
}: EditorToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(resume.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('editor.toolbar');
  const tToast = useTranslations('toast');

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      onTitleChange(titleValue.trim());
      setIsEditingTitle(false);
    }
  };

  const handleTitleCancel = () => {
    setTitleValue(resume.title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading(t('pdfGenerating'), { id: 'pdf-download' });
      
      // Generar el PDF usando @react-pdf/renderer
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
      
      // Crear un enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(t('pdfDownloaded'), { id: 'pdf-download' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('pdfError'), { 
        id: 'pdf-download',
        description: t('pdfErrorDescription'),
      });
    }
  };

  const handleTogglePublic = async () => {
    try {
      const newPublicState = await toggleResumePublic(resume.id);
      
      if (newPublicState) {
        const shareUrl = `${window.location.origin}/preview/${resume.id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success(tToast('cvPublic'), {
          description: t('linkCopied'),
          icon: <Globe className="w-4 h-4" />,
        });
      } else {
        toast.success(tToast('cvPrivate'), {
          icon: <Lock className="w-4 h-4" />,
        });
      }
      
      // Recargar la página para actualizar el estado
      window.location.reload();
    } catch (error) {
      console.error('Error toggling public:', error);
      toast.error('Error al cambiar visibilidad');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <ViewTransitionLink 
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm">{t('back')}</span>
          </ViewTransitionLink>

          <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-700" />

          <div className="min-w-0 flex-1 overflow-hidden">
            {isEditingTitle ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleTitleSave}
                  className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none px-1 w-full"
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1 
                onClick={() => setIsEditingTitle(true)}
                className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {resume.title}
              </h1>
            )}
          </div>

          {/* Save Indicator - Icon only on mobile */}
          <div className="shrink-0">
            <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>

          {/* Progress Badge - Desktop only */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {t('completed')}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onPreviewModeChange('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">{t('desktop')}</span>
            </button>
            <button
              onClick={() => onPreviewModeChange('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-medium">{t('mobile')}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <LanguageSwitcher />
          
          <motion.button
            onClick={onSave}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isSaving ? { scale: [1, 1.05, 1] } : {}}
            transition={isSaving ? { repeat: Infinity, duration: 1 } : {}}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? t('saving') : t('save')}
            </span>
          </motion.button>

          <button 
            onClick={handleDownloadPDF}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">{t('downloadPDF')}</span>
          </button>

          <button 
            onClick={handleTogglePublic}
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm"
            title={resume.isPublic ? t('publicTooltip') : t('privateTooltip')}
          >
            {resume.isPublic ? <Globe className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4" />}
            <span className="hidden lg:inline">{resume.isPublic ? t('makePrivate') : t('makePublic')}</span>
          </button>

          <button 
            onClick={onTogglePreviewExpanded}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            title={isPreviewExpanded ? t('minimize') : t('expand')}
          >
            {isPreviewExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden xl:inline text-sm">{isPreviewExpanded ? t('minimize') : t('expand')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
