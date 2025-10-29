'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../sortable-item';
import { MonthYearPicker } from './month-year-picker';
import type { Project, Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface ProjectsFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function ProjectsForm({ resume, onUpdate }: ProjectsFormProps) {
  const t = useTranslations('editor.projects');
  const [items, setItems] = useState<Project[]>(resume.projects || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onUpdate({ projects: newItems });
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({ name: '', description: '', url: '', github: '', technologies: [] });
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) return;
    
    const projectId = editingId === 'new' ? nanoid() : editingId!;
    const project: Project = {
      id: projectId,
      name: formData.name,
      description: formData.description,
      url: formData.url,
      github: formData.github,
      startDate: formData.startDate,
      endDate: formData.endDate,
      technologies: formData.technologies || [],
    };

    // Verificar si estamos editando un elemento existente
    const existingIndex = items.findIndex((item) => item.id === editingId);
    
    const updated = existingIndex !== -1
      ? items.map((item) => (item.id === editingId ? project : item))
      : [...items, project];

    setItems(updated);
    onUpdate({ projects: updated });
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item: Project) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onUpdate({ projects: updated });
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')} {t('required')}</label>
            <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholders.name')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')} {t('required')}</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder={t('placeholders.description')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('url')}</label>
            <input value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholders.url')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MonthYearPicker
              label={t('startDate')}
              value={formData.startDate || ''}
              onChange={(value) => setFormData({ ...formData, startDate: value })}
            />
            <MonthYearPicker
              label={t('endDate')}
              value={formData.endDate || ''}
              onChange={(value) => setFormData({ ...formData, endDate: value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">{t('save')}</button>
            <button onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">{t('cancel')}</button>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">{t('edit')}</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && !editingId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('empty')}</p>
        </div>
      )}
    </div>
  );
}
