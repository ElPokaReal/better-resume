'use client';

import { Download, Edit, Eye, Star, Copy, Trash2, Globe, Calendar, Clock, MoreVertical, FileText } from 'lucide-react';
import { useState } from 'react';
import { duplicateResume, deleteResume, toggleResumeFavorite } from '@/app/actions/resume';
import { toast } from 'sonner';
import { useDashboard } from '@/contexts/dashboard-context';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTranslations } from 'next-intl';

interface ResumeCardProps {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  template: string;
  isFavorite?: boolean;
  isPublic?: boolean;
  viewMode?: 'grid' | 'list';
  design?: {
    layout?: string;
    colorScheme?: string;
  };
}

export function ResumeCard({ 
  id, 
  title, 
  updatedAt,
  createdAt,
  template, 
  isFavorite = false,
  isPublic = false,
  viewMode = 'grid',
  design
}: ResumeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { refreshResumes } = useDashboard();
  const t = useTranslations('dashboard.card');
  const tToast = useTranslations('toast');
  
  const handleToggleFavorite = async () => {
    try {
      const newFavoriteState = !favorite;
      setFavorite(newFavoriteState);
      await toggleResumeFavorite(id);
      toast.success(favorite ? tToast('removedFromFavorites') : tToast('addedToFavorites'));
      // Refrescar la lista para actualizar los contadores
      await refreshResumes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorite(favorite); // Revertir en caso de error
      toast.error('Error al actualizar favorito');
    }
  };

  const handleEdit = () => {
    window.location.href = `/editor/${id}`;
  };

  const handlePreview = () => {
    window.open(`/preview/${id}`, '_blank');
  };

  const handleDownload = () => {
    toast.loading(tToast('pdfGenerating'), { id: 'pdf-download' });
    
    // Abrir la ruta API que genera el PDF
    const pdfUrl = `/api/resume/${id}/pdf`;
    window.open(pdfUrl, '_blank');
    
    // Dar tiempo para que se abra y luego mostrar éxito
    setTimeout(() => {
      toast.success(tToast('pdfGenerated'), { 
        id: 'pdf-download',
        description: tToast('pdfDescription')
      });
    }, 1000);
  };

  const handleDuplicate = async () => {
    try {
      toast.loading(tToast('duplicating'), { id: 'duplicate' });
      await duplicateResume(id);
      toast.success(tToast('cvDuplicated'), { id: 'duplicate' });
      // Recargar lista de resumes
      await refreshResumes();
    } catch (error) {
      console.error('Error duplicating:', error);
      toast.error(tToast('duplicateError'), { id: 'duplicate' });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      toast.loading(tToast('deleting'), { id: 'delete' });
      await deleteResume(id);
      toast.success(tToast('cvDeleted'), { id: 'delete' });
      // Recargar lista de resumes
      await refreshResumes();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(tToast('deleteError'), { id: 'delete' });
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

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg overflow-hidden">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Thumbnail Preview */}
          <div className="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700">
            <div className="absolute inset-2 bg-white dark:bg-gray-950 rounded-sm overflow-hidden">
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: getAccentColor(design?.colorScheme) }}
              />
              <div className="p-2 space-y-1">
                <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: getAccentColor(design?.colorScheme) + '25' }} />
                <div className="h-1 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-0.5 w-full rounded" style={{ backgroundColor: getAccentColor(design?.colorScheme) + '30' }} />
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-1 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                    {title}
                  </h3>
                  {isPublic && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-md text-xs font-medium text-green-700 dark:text-green-400">
                      <Globe className="w-3 h-3" />
                      <span className="hidden sm:inline">{t('public')}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {template}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {updatedAt}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('createdAt', { date: createdAt })}
                  </span>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Star className={`w-5 h-5 transition-colors ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`} />
              </button>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                {t('edit')}
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('preview')}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                title={t('download')}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleDuplicate}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                title={t('duplicate')}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                title={t('delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Actions - Mobile */}
            <div className="flex sm:hidden items-center gap-2 mt-3">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                {t('edit')}
              </button>
              <button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('view')}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
                    <button
                      onClick={() => { handleDownload(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors first:rounded-t-xl"
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                    <button
                      onClick={() => { handleDuplicate(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {t('duplicate')}
                    </button>
                    <button
                      onClick={() => { handleDeleteClick(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors last:rounded-b-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={t('confirmDelete')}
          description={t('confirmDeleteMessage', { title })}
          confirmText={t('confirmButton')}
          cancelText={t('cancelButton')}
          onConfirm={handleConfirmDelete}
          variant="danger"
        />
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 overflow-hidden hover:shadow-xl">
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
            title={t('preview')}
          >
            <Eye className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleEdit}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title={t('edit')}
          >
            <Edit className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDuplicate}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title={t('duplicate')}
          >
            <Copy className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title={t('download')}
          >
            <Download className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title={t('delete')}
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate mb-2">
              {title}
            </h3>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('createdAt', { date: createdAt })}</span>
              </div>
            </div>
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors -mt-1"
          >
            <Star className={`w-5 h-5 transition-colors ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`} />
          </button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden gap-2">
          <button 
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{t('view')}</span>
          </button>
          <button 
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{t('edit')}</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
            title={t('download')}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('confirmDelete')}
        description={t('confirmDeleteMessage', { title })}
        confirmText={t('confirmButton')}
        cancelText={t('cancelButton')}
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  );
}
