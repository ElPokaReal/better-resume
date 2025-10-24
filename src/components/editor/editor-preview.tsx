'use client';

import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resume } from '@/types/resume';

interface EditorPreviewProps {
  resume: Resume;
  previewMode: 'desktop' | 'mobile';
  isExpanded: boolean;
}

// Color scheme mapping
const colorSchemes = {
  blue: { primary: '#3B82F6', light: '#DBEAFE', dark: '#1E40AF' },
  green: { primary: '#10B981', light: '#D1FAE5', dark: '#047857' },
  purple: { primary: '#8B5CF6', light: '#EDE9FE', dark: '#6D28D9' },
  red: { primary: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
  gray: { primary: '#6B7280', light: '#F3F4F6', dark: '#374151' },
};

// Font family mapping
const fontFamilies = {
  inter: 'Inter, sans-serif',
  roboto: 'Roboto, sans-serif',
  'open-sans': '"Open Sans", sans-serif',
  lato: 'Lato, sans-serif',
  montserrat: 'Montserrat, sans-serif',
};

// Spacing mapping
const spacingClasses = {
  compact: 'space-y-4',
  normal: 'space-y-6',
  relaxed: 'space-y-8',
};

export function EditorPreview({ resume, previewMode, isExpanded }: EditorPreviewProps) {
  const design = resume.design || {};
  const colorScheme = colorSchemes[design.colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;
  const fontFamily = fontFamilies[design.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;
  const spacing = spacingClasses[design.spacing as keyof typeof spacingClasses] || spacingClasses.normal;
  const fontSize = design.fontSize || 14;
  const layout = design.layout || 'single-column';

  const renderContent = () => {
    switch (layout) {
      case 'two-column':
        return renderTwoColumnLayout();
      case 'sidebar':
        return renderSidebarLayout();
      default:
        return renderSingleColumnLayout();
    }
  };

  const renderSingleColumnLayout = () => (
    <div className={`w-full h-full bg-white p-12 ${spacing}`}>
            {/* Personal Info Section */}
            {resume.personalInfo && (
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {resume.personalInfo.fullName || 'Tu Nombre'}
                </h1>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-4">
                  {resume.personalInfo.email && (
                    <span className="flex items-center gap-1">
                      {resume.personalInfo.email}
                    </span>
                  )}
                  {resume.personalInfo.phone && (
                    <>
                      {resume.personalInfo.email && <span>•</span>}
                      <span>{resume.personalInfo.phone}</span>
                    </>
                  )}
                  {resume.personalInfo.location && (
                    <>
                      {(resume.personalInfo.email || resume.personalInfo.phone) && <span>•</span>}
                      <span>{resume.personalInfo.location}</span>
                    </>
                  )}
                </div>

                {/* Links */}
                {(resume.personalInfo.website || resume.personalInfo.linkedin || resume.personalInfo.github) && (
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm mb-4">
                    {resume.personalInfo.website && (
                    <a href={resume.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colorScheme.primary }}>
                      {resume.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {resume.personalInfo.linkedin && (
                    <>
                      {resume.personalInfo.website && <span className="text-gray-400">•</span>}
                      <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colorScheme.primary }}>
                        LinkedIn
                      </a>
                    </>
                  )}
                  {resume.personalInfo.github && (
                    <>
                      {(resume.personalInfo.website || resume.personalInfo.linkedin) && <span className="text-gray-400">•</span>}
                      <a href={resume.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colorScheme.primary }}>
                        GitHub
                      </a>
                    </>
                  )}
                  </div>
                )}

                {/* Summary */}
                {resume.personalInfo.summary && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-left">
                      {resume.personalInfo.summary}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {resume.sectionVisibility.experience && resume.experience.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
                  style={{ borderColor: colorScheme.primary }}
                >
                  Experiencia Profesional
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-gray-700">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <p>{exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resume.sectionVisibility.education && resume.education.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
                  style={{ borderColor: colorScheme.primary }}
                >
                  Educación
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {edu.degree} en {edu.field}
                          </h3>
                          <p className="text-gray-700">{edu.institution}</p>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <p>{edu.startDate} - {edu.current ? 'Presente' : edu.endDate}</p>
                          {edu.location && <p>{edu.location}</p>}
                        </div>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {resume.sectionVisibility.skills && resume.skills.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
                  style={{ borderColor: colorScheme.primary }}
                >
                  Habilidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: colorScheme.light, 
                        color: colorScheme.dark 
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {resume.sectionVisibility.projects && resume.projects.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
                  style={{ borderColor: colorScheme.primary }}
                >
                  Proyectos
                </h2>
                <div className="space-y-4">
                  {resume.projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex items-center gap-2">
                        {project.url ? (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg font-semibold hover:underline flex items-center gap-1"
                            style={{ color: colorScheme.primary }}
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.name}
                          </h3>
                        )}
                        {(project.startDate || project.endDate) && (
                          <span className="text-sm text-gray-600">
                            ({project.startDate && new Date(project.startDate).toLocaleDateString('es', { month: 'short', year: 'numeric' })}
                            {project.startDate && project.endDate && ' - '}
                            {project.endDate && new Date(project.endDate).toLocaleDateString('es', { month: 'short', year: 'numeric' })})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {resume.sectionVisibility.certifications && resume.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Certificaciones
                </h2>
                <div className="space-y-3">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-700">
                        {cert.issuer} • {cert.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {resume.sectionVisibility.languages && resume.languages.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
                  style={{ borderColor: colorScheme.primary }}
                >
                  Idiomas
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {resume.languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-semibold text-gray-900">{lang.language}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({lang.proficiency})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className={`w-full h-full bg-white p-12 grid grid-cols-3 gap-8 ${spacing}`}>
      {/* Left Column - Main Content (2/3) */}
      <div className="col-span-2 space-y-6">
        {/* Personal Info Header */}
        {resume.personalInfo && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {resume.personalInfo.fullName || 'Tu Nombre'}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
              {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
              {resume.personalInfo.phone && <><span>•</span><span>{resume.personalInfo.phone}</span></>}
              {resume.personalInfo.location && <><span>•</span><span>{resume.personalInfo.location}</span></>}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.sectionVisibility.experience && resume.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              Experiencia
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-600">{exp.company} • {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</p>
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.sectionVisibility.education && resume.education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              Educación
            </h2>
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-gray-900">{edu.degree} en {edu.field}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Sidebar (1/3) */}
      <div className="space-y-6">
        {/* Contact Links */}
        {(resume.personalInfo?.website || resume.personalInfo?.linkedin || resume.personalInfo?.github) && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Enlaces</h3>
            <div className="space-y-1 text-sm">
              {resume.personalInfo.website && (
                <a href={resume.personalInfo.website} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.primary }}>
                  Website
                </a>
              )}
              {resume.personalInfo.linkedin && (
                <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.primary }}>
                  LinkedIn
                </a>
              )}
              {resume.personalInfo.github && (
                <a href={resume.personalInfo.github} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.primary }}>
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.sectionVisibility.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colorScheme.light, color: colorScheme.dark }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.sectionVisibility.languages && resume.languages.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Idiomas</h3>
            <div className="space-y-1">
              {resume.languages.map((lang) => (
                <div key={lang.id} className="text-sm">
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-gray-600 text-xs ml-1">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSidebarLayout = () => (
    <div className={`w-full h-full bg-white flex ${spacing}`}>
      {/* Left Sidebar - 1/3 */}
      <div className="w-1/3 p-8 space-y-6" style={{ backgroundColor: colorScheme.light }}>
        {/* Personal Info */}
        {resume.personalInfo && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {resume.personalInfo.fullName || 'Tu Nombre'}
            </h1>
            <div className="space-y-1 text-sm text-gray-700">
              {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
              {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
              {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
            </div>
          </div>
        )}

        {/* Links */}
        {(resume.personalInfo?.website || resume.personalInfo?.linkedin || resume.personalInfo?.github) && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Enlaces</h3>
            <div className="space-y-1 text-sm">
              {resume.personalInfo.website && (
                <a href={resume.personalInfo.website} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.dark }}>
                  Website
                </a>
              )}
              {resume.personalInfo.linkedin && (
                <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.dark }}>
                  LinkedIn
                </a>
              )}
              {resume.personalInfo.github && (
                <a href={resume.personalInfo.github} target="_blank" rel="noopener noreferrer" className="block hover:underline" style={{ color: colorScheme.dark }}>
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.sectionVisibility.skills && resume.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 bg-white rounded text-xs font-medium" style={{ color: colorScheme.dark }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.sectionVisibility.languages && resume.languages.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Idiomas</h3>
            <div className="space-y-1">
              {resume.languages.map((lang) => (
                <div key={lang.id} className="text-sm">
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-gray-600 text-xs ml-1">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - 2/3 */}
      <div className="w-2/3 p-12 space-y-6">
        {/* Experience */}
        {resume.sectionVisibility.experience && resume.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              Experiencia Profesional
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-600">{exp.company} • {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</p>
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.sectionVisibility.education && resume.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              Educación
            </h2>
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree} en {edu.field}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.sectionVisibility.projects && resume.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              Proyectos
            </h2>
            <div className="space-y-3">
              {resume.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 ${
        isExpanded ? 'flex-1' : 'w-[600px]'
      }`}
    >
      {/* Preview Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Vista Previa</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Página 1 / 1</span>
          </div>
        </div>
      </div>

      {/* Preview Content - Scrollable */}
      <div className="p-8 flex justify-center">
        <div
          data-resume-preview
          className={`bg-white shadow-2xl ${
            previewMode === 'mobile'
              ? 'w-[375px] min-h-[667px]'
              : 'w-[210mm] min-h-[297mm]'
          }`}
          style={{
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={layout}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
