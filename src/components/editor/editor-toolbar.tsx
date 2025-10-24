'use client';

import { useState, useRef, useEffect } from 'react';
import { Save, Download, Eye, Share2, Monitor, Smartphone, ArrowLeft, Maximize2, Minimize2, Check, X } from 'lucide-react';
import { ViewTransitionLink } from '@/components/view-transition-link';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/resume-pdf';
import { motion } from 'framer-motion';
import type { Resume } from '@/types/resume';

interface EditorToolbarProps {
  resume: Resume;
  isSaving: boolean;
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
      toast.loading('Generando PDF...', { id: 'pdf-download' });
      
      // Generar el PDF usando @react-pdf/renderer
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
      
      // Crear un enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.title || 'CV'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF descargado exitosamente', { 
        id: 'pdf-download',
        description: 'Tu CV ha sido exportado en formato PDF',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar PDF', { 
        id: 'pdf-download',
        description: 'No se pudo exportar el CV. Intenta de nuevo.',
      });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <ViewTransitionLink
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver</span>
          </ViewTransitionLink>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />

          <div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleTitleSave}
                  className="text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none px-1"
                  style={{ width: `${Math.max(titleValue.length * 10, 150)}px` }}
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1 
                onClick={() => setIsEditingTitle(true)}
                className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {resume.title}
              </h1>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isSaving ? 'Guardando...' : 'Todos los cambios guardados'}
            </p>
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
              <span className="text-sm font-medium">Desktop</span>
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
              <span className="text-sm font-medium">Mobile</span>
            </button>
          </div>

          {/* Action Buttons */}
          <motion.button
            onClick={onSave}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isSaving ? { scale: [1, 1.05, 1] } : {}}
            transition={isSaving ? { repeat: Infinity, duration: 1 } : {}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? 'Guardando...' : 'Guardar'}
            </span>
          </motion.button>

          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>

          <button 
            onClick={onTogglePreviewExpanded}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            title={isPreviewExpanded ? 'Minimizar vista previa' : 'Expandir vista previa'}
          >
            {isPreviewExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPreviewExpanded ? 'Minimizar' : 'Expandir'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
