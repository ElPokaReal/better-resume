'use client';

import { FileText, Download, Edit, Eye, Star } from 'lucide-react';
import { useState } from 'react';

interface ResumeCardProps {
  id: string;
  title: string;
  updatedAt: string;
  template: string;
  isFavorite?: boolean;
}

export function ResumeCard({ id, title, updatedAt, template, isFavorite = false }: ResumeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleEdit = () => {
    window.location.href = `/editor/${id}`;
  };

  const handlePreview = () => {
    window.open(`/preview/${id}`, '_blank');
  };

  const handleDownload = async () => {
    // TODO: Implementar descarga de PDF
    console.log('Descargar PDF:', id);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 overflow-hidden hover:shadow-xl">
      {/* Preview Area */}
      <div className="aspect-[8.5/11] bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
        {/* Simple grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        {/* Document icon */}
        <div className="relative z-10 group-hover:z-0 transition-all duration-200">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Favorite star badge */}
        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute top-3 left-3 z-40 p-1.5 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform shadow-sm"
        >
          <Star className={`w-4 h-4 ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </button>
        
        {/* Template badge */}
        <div className="absolute top-3 right-3 z-40 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          {template}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 z-30 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
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
            onClick={handleDownload}
            className="p-2.5 bg-white rounded-lg hover:scale-110 transition-transform"
            title="Descargar PDF"
          >
            <Download className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {updatedAt}
          </p>
        </div>
      </div>
    </div>
  );
}
