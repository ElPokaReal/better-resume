'use client';

import { PersonalInfoForm } from './forms/personal-info-form';
import { ExperienceForm } from './forms/experience-form';
import { EducationForm } from './forms/education-form';
import { SkillsForm } from './forms/skills-form';
import { ProjectsForm } from './forms/projects-form';
import { CertificationsForm } from './forms/certifications-form';
import { LanguagesForm } from './forms/languages-form';
import { DesignForm } from './forms/design-form';
import type { Resume, EditorSection } from '@/types/resume';

interface EditorFormPanelProps {
  activeSection: EditorSection;
  resume: Resume;
  onResumeUpdate: (updates: Partial<Resume>) => void;
}

export function EditorFormPanel({
  activeSection,
  resume,
  onResumeUpdate,
}: EditorFormPanelProps) {
  const renderForm = () => {
    switch (activeSection) {
      case 'personal-info':
        return <PersonalInfoForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'experience':
        return <ExperienceForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'education':
        return <EducationForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'skills':
        return <SkillsForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'projects':
        return <ProjectsForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'certifications':
        return <CertificationsForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'languages':
        return <LanguagesForm resume={resume} onUpdate={onResumeUpdate} />;
      case 'design':
        return <DesignForm resume={resume} onUpdate={onResumeUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto p-6">
        {renderForm()}
      </div>
    </div>
  );
}
