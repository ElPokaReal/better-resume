'use client';

import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <FileText className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No tienes currículums aún
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        Comienza creando tu primer currículum profesional. Es rápido y fácil.
      </p>
      
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
        Crear mi primer currículum
      </button>
      
      {/* Feature hints */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rápido y fácil</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">100% personalizable</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Descarga en PDF</p>
        </div>
      </div>
    </div>
  );
}
