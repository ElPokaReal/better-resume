'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../sortable-item';
import { MonthYearPicker } from './month-year-picker';
import { experienceSchema, type Experience, type Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Controller } from 'react-hook-form';

interface ExperienceFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function ExperienceForm({ resume, onUpdate }: ExperienceFormProps) {
  const t = useTranslations('editor.experience');
  const tPreview = useTranslations('editor.preview');
  const [experiences, setExperiences] = useState<Experience[]>(resume.experience || []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((item) => item.id === active.id);
      const newIndex = experiences.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(experiences, oldIndex, newIndex);
      setExperiences(newItems);
      onUpdate({ experience: newItems });
    }
  };

  const handleAdd = () => {
    const newExp: Experience = {
      id: nanoid(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setEditingId(newExp.id);
    reset(newExp);
  };

  const handleSave = (data: Experience) => {
    // Verificar si estamos editando un elemento existente
    const existingIndex = experiences.findIndex((exp) => exp.id === editingId);
    
    const updatedExperiences = existingIndex !== -1
      ? experiences.map((exp) => (exp.id === editingId ? { ...data, id: editingId } : exp))
      : [...experiences, { ...data, id: editingId || nanoid() }];

    setExperiences(updatedExperiences);
    onUpdate({ experience: updatedExperiences });
    setEditingId(null);
    reset();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    reset(exp);
  };

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    onUpdate({ experience: updatedExperiences });
    if (editingId === id) {
      setEditingId(null);
      reset();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const isCurrent = watch('current');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('title')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </div>

      {/* Editing Form */}
      {editingId && (
        <form onSubmit={handleSubmit(handleSave)} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('position')} {t('required')}
              </label>
              <input
                {...register('position')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('placeholders.position')}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('company')} {t('required')}
              </label>
              <input
                {...register('company')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('placeholders.company')}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('location')}
            </label>
            <input
              {...register('location')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('placeholders.location')}
            />
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
            <input
              {...register('current')}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('current')}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('description')} {t('required')}
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t('placeholders.description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('save')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {/* Experience List with Drag & Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experiences.map((exp) => exp.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <SortableItem key={exp.id} id={exp.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {exp.position}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.company} • {exp.startDate} - {exp.current ? tPreview('present') : exp.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {experiences.length === 0 && !editingId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('empty')}</p>
          <p className="text-sm mt-1">{t('emptyHint')}</p>
        </div>
      )}
    </div>
  );
}
