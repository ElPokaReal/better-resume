'use client';

import { useState } from 'react';
import type { Certification, Resume } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface CertificationsFormProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function CertificationsForm({ resume, onUpdate }: CertificationsFormProps) {
  const [items, setItems] = useState<Certification[]>(resume.certifications || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({});

  const handleAdd = () => {
    setEditingId('new');
    setFormData({ name: '', issuer: '', date: '' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.issuer || !formData.date) return;
    
    const certId = editingId === 'new' ? nanoid() : editingId!;
    const cert: Certification = {
      id: certId,
      name: formData.name,
      issuer: formData.issuer,
      date: formData.date,
      expiryDate: formData.expiryDate,
      credentialId: formData.credentialId,
      url: formData.url,
    };

    // Verificar si estamos editando un elemento existente
    const existingIndex = items.findIndex((item) => item.id === editingId);
    
    const updated = existingIndex !== -1
      ? items.map((item) => (item.id === editingId ? cert : item))
      : [...items, cert];

    setItems(updated);
    onUpdate({ certifications: updated });
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item: Certification) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onUpdate({ certifications: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificaciones</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Agrega tus certificaciones profesionales</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {editingId && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
            <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emisor *</label>
            <input value={formData.issuer || ''} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha *</label>
            <input value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} type="month" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Guardar</button>
            <button onClick={() => { setEditingId(null); setFormData({}); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.issuer} • {item.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !editingId && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No has agregado certificaciones</p>
        </div>
      )}
    </div>
  );
}
