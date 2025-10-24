'use client';

import { useState } from 'react';
import type { Resume } from '@/types/resume';

interface DesignFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function DesignForm({ resume, onUpdate }: DesignFormProps) {
  const [design, setDesign] = useState(resume.design || {
    colorScheme: 'blue' as const,
    fontFamily: 'inter' as const,
    layout: 'single-column' as const,
    spacing: 'normal' as const,
    fontSize: 14,
  });

  const handleChange = (key: string, value: any) => {
    const updated = { ...design, [key]: value };
    setDesign(updated);
    onUpdate({ design: updated });
  };

  const colorSchemes = [
    { value: 'blue', label: 'Azul', color: '#3B82F6' },
    { value: 'green', label: 'Verde', color: '#10B981' },
    { value: 'purple', label: 'Púrpura', color: '#8B5CF6' },
    { value: 'red', label: 'Rojo', color: '#EF4444' },
    { value: 'gray', label: 'Gris', color: '#6B7280' },
  ];

  const fonts = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'montserrat', label: 'Montserrat' },
  ];

  const layouts = [
    { value: 'single-column', label: 'Una Columna' },
    { value: 'two-column', label: 'Dos Columnas' },
    { value: 'sidebar', label: 'Con Sidebar' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Diseño y Estilo</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Personaliza la apariencia de tu CV</p>
      </div>

      {/* Color Scheme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Esquema de Color</label>
        <div className="grid grid-cols-5 gap-3">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => handleChange('colorScheme', scheme.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                design.colorScheme === scheme.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: scheme.color }} />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{scheme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuente</label>
        <select
          value={design.fontFamily || 'inter'}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>

      {/* Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Diseño
        </label>
        <div className="grid grid-cols-3 gap-3">
          {layouts.map((layout) => (
            <button
              key={layout.value}
              onClick={() => handleChange('layout', layout.value)}
              className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                design.layout === layout.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {layout.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          • <strong>Una Columna:</strong> Layout tradicional centrado<br />
          • <strong>Dos Columnas:</strong> Contenido principal + sidebar derecho<br />
          • <strong>Con Sidebar:</strong> Sidebar izquierdo con fondo de color
        </p>
      </div>

      {/* Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Espaciado</label>
        <div className="grid grid-cols-3 gap-3">
          {['compact', 'normal', 'relaxed'].map((spacing) => (
            <button
              key={spacing}
              onClick={() => handleChange('spacing', spacing)}
              className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                design.spacing === spacing
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {spacing}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tamaño de Fuente: {design.fontSize || 14}px
        </label>
        <input
          type="range"
          min="12"
          max="18"
          value={design.fontSize || 14}
          onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
