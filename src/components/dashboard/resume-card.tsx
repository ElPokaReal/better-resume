'use client';

import { Download, Edit, Eye, Star, Copy, Trash2, Globe } from 'lucide-react';
import { useState } from 'react';
import { duplicateResume, deleteResume } from '@/app/actions/resume';
import { toast } from 'sonner';
import { useDashboard } from '@/contexts/dashboard-context';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ResumeCardProps {
  id: string;
  title: string;
  updatedAt: string;
  template: string;
  isFavorite?: boolean;
  isPublic?: boolean;
  design?: {
    layout?: string;
    colorScheme?: string;
  };
}

export function ResumeCard({ 
  id, 
  title, 
  updatedAt, 
  template, 
  isFavorite = false,
  isPublic = false,
  design
}: ResumeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { refreshResumes } = useDashboard();

  const handleEdit = () => {
    window.location.href = `/editor/${id}`;
  };

  const handlePreview = () => {
    window.open(`/preview/${id}`, '_blank');
  };

  const handleDownload = () => {
    toast.loading('Generando PDF...', { id: 'pdf-download' });
    
    // Abrir la ruta API que genera el PDF
    const pdfUrl = `/api/resume/${id}/pdf`;
    window.open(pdfUrl, '_blank');
    
    // Dar tiempo para que se abra y luego mostrar éxito
    setTimeout(() => {
      toast.success('PDF generado', { 
        id: 'pdf-download',
        description: 'El PDF se abrirá en una nueva pestaña'
      });
    }, 1000);
  };

  const handleDuplicate = async () => {
    try {
      toast.loading('Duplicando CV...', { id: 'duplicate' });
      await duplicateResume(id);
      toast.success('CV duplicado', { id: 'duplicate' });
      // Recargar lista de resumes
      await refreshResumes();
    } catch (error) {
      console.error('Error duplicating:', error);
      toast.error('Error al duplicar CV', { id: 'duplicate' });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      toast.loading('Eliminando CV...', { id: 'delete' });
      await deleteResume(id);
      toast.success('CV eliminado', { id: 'delete' });
      // Recargar lista de resumes
      await refreshResumes();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error al eliminar CV', { id: 'delete' });
    }
  };

  // Color scheme mapping
  const getAccentColor = (scheme?: string) => {
    const colors: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      red: '#EF4444',
      orange: '#F59E0B',
    };
    return colors[scheme || 'blue'] || colors.blue;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 overflow-hidden hover:shadow-xl">
      {/* Preview Area */}
      <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Paper Background */}
        <div className="absolute inset-4 bg-white dark:bg-gray-950 rounded-sm shadow-lg overflow-hidden">
          {/* Accent Bar */}
          <div 
            className="h-3 w-full"
            style={{ backgroundColor: getAccentColor(design?.colorScheme) }}
          />
          
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Header - Name */}
            <div className="space-y-1.5">
              <div 
                className="h-4 w-3/4 rounded"
                style={{ backgroundColor: getAccentColor(design?.colorScheme) + '25' }}
              />
              <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            
            {/* Divider */}
            <div 
              className="h-0.5 w-full rounded"
              style={{ backgroundColor: getAccentColor(design?.colorScheme) + '30' }}
            />
            
            {/* Section 1 */}
            <div className="space-y-1.5">
              <div 
                className="h-2.5 w-1/3 rounded"
                style={{ backgroundColor: getAccentColor(design?.colorScheme) + '40' }}
              />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1.5 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1.5 w-4/6 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
            
            {/* Section 2 */}
            <div className="space-y-1.5">
              <div 
                className="h-2.5 w-1/4 rounded"
                style={{ backgroundColor: getAccentColor(design?.colorScheme) + '40' }}
              />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1.5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
            
            {/* Section 3 */}
            <div className="space-y-1.5">
              <div 
                className="h-2.5 w-1/3 rounded"
                style={{ backgroundColor: getAccentColor(design?.colorScheme) + '40' }}
              />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1.5 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1.5 w-3/5 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Favorite star badge */}
        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute top-3 left-3 z-40 p-1.5 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform shadow-sm"
        >
          <Star className={`w-4 h-4 ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </button>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 z-40 flex gap-2">
          {isPublic && (
            <div className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 rounded-md text-xs font-medium text-green-700 dark:text-green-400 shadow-sm flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>Público</span>
            </div>
          )}
          <div className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
            {template}
          </div>
        </div>
        
        {/* Hover Overlay - Desktop only */}
        <div className="hidden md:flex absolute inset-0 z-30 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2">
          <button 
            onClick={handlePreview}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Ver preview"
          >
            <Eye className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleEdit}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Editar"
          >
            <Edit className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDuplicate}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Duplicar"
          >
            <Copy className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Descargar PDF"
          >
            <Download className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex-1 min-w-0 mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {updatedAt}
          </p>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden gap-2">
          <button 
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Ver</span>
          </button>
          <button 
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
            title="Descargar PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Eliminar Currículum"
        description={`¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  );
}
