'use client';

import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Languages,
  Palette,
} from 'lucide-react';
import type { EditorSection } from '@/types/resume';

interface EditorSidebarProps {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
}

const sections = [
  { id: 'personal-info', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experiencia', icon: Briefcase },
  { id: 'education', label: 'Educación', icon: GraduationCap },
  { id: 'skills', label: 'Habilidades', icon: Code },
  { id: 'projects', label: 'Proyectos', icon: FolderGit2 },
  { id: 'certifications', label: 'Certificaciones', icon: Award },
  { id: 'languages', label: 'Idiomas', icon: Languages },
  { id: 'design', label: 'Diseño', icon: Palette },
] as const;

export function EditorSidebar({
  activeSection,
  onSectionChange,
}: EditorSidebarProps) {
  return (
    <div className="w-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Section Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-2 px-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id as EditorSection)}
                className={`w-full flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={section.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium text-center leading-tight">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
