'use client';

import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../sortable-item';
import type { Skill, Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface SkillsFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function SkillsForm({ resume, onUpdate }: SkillsFormProps) {
  const [items, setItems] = useState<Skill[]>(resume.skills || []);
  const [newSkill, setNewSkill] = useState('');

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
      onUpdate({ skills: newItems });
    }
  };

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    const updated = [...items, { id: nanoid(), name: newSkill.trim(), level: 'intermediate' as const }];
    setItems(updated);
    onUpdate({ skills: updated });
    setNewSkill('');
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onUpdate({ skills: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Habilidades</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Agrega tus habilidades técnicas y blandas</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: React, TypeScript, Node.js..."
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No has agregado habilidades</p>
          <p className="text-sm mt-1">Escribe una habilidad y presiona Enter</p>
        </div>
      )}
    </div>
  );
}
