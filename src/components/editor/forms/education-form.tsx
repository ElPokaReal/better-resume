'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../sortable-item';
import { MonthYearPicker } from './month-year-picker';
import { educationSchema, type Education, type Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Controller } from 'react-hook-form';

interface EducationFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function EducationForm({ resume, onUpdate }: EducationFormProps) {
  const t = useTranslations('editor.education');
  const tPreview = useTranslations('editor.preview');
  const [items, setItems] = useState<Education[]>(resume.education || []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<Education>({
    resolver: zodResolver(educationSchema),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onUpdate({ education: newItems });
    }
  };

  const handleAdd = () => {
    const newItem: Education = {
      id: nanoid(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
    };
    setEditingId(newItem.id);
    reset(newItem);
  };

  const handleSave = (data: Education) => {
    // Verificar si estamos editando un elemento existente
    const existingIndex = items.findIndex((item) => item.id === editingId);
    
    const updated = existingIndex !== -1
      ? items.map((item) => (item.id === editingId ? { ...data, id: editingId } : item))
      : [...items, { ...data, id: editingId || nanoid() }];
    setItems(updated);
    onUpdate({ education: updated });
    setEditingId(null);
    reset();
  };

  const handleEdit = (item: Education) => {
    setEditingId(item.id);
    reset(item);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onUpdate({ education: updated });
    if (editingId === id) {
      setEditingId(null);
      reset();
    }
  };

  const isCurrent = watch('current');

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
        <form onSubmit={handleSubmit(handleSave)} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('degree')} {t('required')}</label>
              <input {...register('degree')} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholders.degree')} />
              {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('field')} {t('required')}</label>
              <input {...register('field')} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholders.field')} />
              {errors.field && <p className="mt-1 text-sm text-red-600">{errors.field.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('institution')} {t('required')}</label>
            <input {...register('institution')} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('placeholders.institution')} />
            {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <MonthYearPicker
                  label={`${t('startDate')} ${t('required')}`}
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <MonthYearPicker
                  label={t('endDate')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={isCurrent}
                />
              )}
            />
          </div>

          <div className="flex items-center">
            <input {...register('current')} type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('current')}</label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">{t('save')}</button>
            <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">{t('cancel')}</button>
          </div>
        </form>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.degree} en {item.field}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.institution} • {item.startDate} - {item.current ? tPreview('present') : item.endDate}</p>
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
          <p className="text-sm mt-1">{t('emptyHint')}</p>
        </div>
      )}
    </div>
  );
}
