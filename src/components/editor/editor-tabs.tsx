'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Award, 
  Languages, 
  Palette,
  Check
} from 'lucide-react';
import type { EditorSection } from '@/types/resume';

interface EditorTabsProps {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
  completedSections: EditorSection[];
  progress: number;
}

const sections = [
  { id: 'personal-info' as EditorSection, label: 'Personal', icon: User },
  { id: 'experience' as EditorSection, label: 'Experiencia', icon: Briefcase },
  { id: 'education' as EditorSection, label: 'Educación', icon: GraduationCap },
  { id: 'skills' as EditorSection, label: 'Habilidades', icon: Code },
  { id: 'projects' as EditorSection, label: 'Proyectos', icon: FolderGit2 },
  { id: 'certifications' as EditorSection, label: 'Certificados', icon: Award },
  { id: 'languages' as EditorSection, label: 'Idiomas', icon: Languages },
  { id: 'design' as EditorSection, label: 'Diseño', icon: Palette },
];

export function EditorTabs({ activeSection, onSectionChange, completedSections, progress }: EditorTabsProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progreso
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {completedSections.length} de {sections.length} secciones completadas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.includes(section.id);

            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-3 flex-1">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
