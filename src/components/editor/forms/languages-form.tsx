'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Language, Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface LanguagesFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function LanguagesForm({ resume, onUpdate }: LanguagesFormProps) {
  const t = useTranslations('editor.languages');
  const [items, setItems] = useState<Language[]>(resume.languages || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Language>>({});

  const proficiencyLevels = [
    { value: 'basic', label: t('levels.basic') },
    { value: 'conversational', label: t('levels.conversational') },
    { value: 'fluent', label: t('levels.fluent') },
    { value: 'native', label: t('levels.native') },
  ];

  const handleAdd = () => {
    setEditingId('new');
    setFormData({ language: '', proficiency: 'conversational' });
  };

  const handleSave = () => {
    if (!formData.language || !formData.proficiency) return;
    
    const langId = editingId === 'new' ? nanoid() : editingId!;
    const lang: Language = {
      id: langId,
      language: formData.language,
      proficiency: formData.proficiency as 'basic' | 'conversational' | 'fluent' | 'native',
    };

    // Verificar si estamos editando un elemento existente
    const existingIndex = items.findIndex((item) => item.id === editingId);
    
    const updated = existingIndex !== -1
      ? items.map((item) => (item.id === editingId ? lang : item))
      : [...items, lang];

    setItems(updated);
    onUpdate({ languages: updated });
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item: Language) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onUpdate({ languages: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </div>

      {editingId && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('language')} {t('required')}</label>
            <input value={formData.language || ''} onChange={(e) => setFormData({ ...formData, language: e.target.value })} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('proficiency')} {t('required')}</label>
            <select value={formData.proficiency || 'conversational'} onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">{t('save')}</button>
            <button onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">{t('cancel')}</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.language}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.proficiency}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">{t('edit')}</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !editingId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('empty')}</p>
        </div>
      )}
    </div>
  );
}
