import { z } from 'zod';

// Personal Info Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  github: z.string().url('URL inválida').optional().or(z.literal('')),
  summary: z.string().optional(),
  profileImage: z.string().optional(),
});

// Experience Schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'La empresa es requerida'),
  position: z.string().min(1, 'El puesto es requerido'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, 'La descripción es requerida'),
  achievements: z.array(z.string()).optional(),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'La institución es requerida'),
  degree: z.string().min(1, 'El título es requerido'),
  field: z.string().min(1, 'El campo de estudio es requerido'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

// Skills Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre de la habilidad es requerido'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  category: z.string().optional(),
});

// Projects Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre del proyecto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  github: z.string().url('URL inválida').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

// Certifications Schema
export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre de la certificación es requerido'),
  issuer: z.string().min(1, 'El emisor es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
});

// Languages Schema
export const languageSchema = z.object({
  id: z.string(),
  language: z.string().min(1, 'El idioma es requerido'),
  proficiency: z.enum(['basic', 'conversational', 'fluent', 'native']),
});

// Custom Section Schema
export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  order: z.number(),
});

// Design Schema
export const designSchema = z.object({
  colorScheme: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  spacing: z.enum(['compact', 'normal', 'relaxed']).optional(),
  accentColor: z.string().optional(),
  layout: z.enum(['single-column', 'two-column', 'sidebar']).optional(),
});

// Section Visibility Schema
export const sectionVisibilitySchema = z.object({
  experience: z.boolean().default(true),
  education: z.boolean().default(true),
  skills: z.boolean().default(true),
  projects: z.boolean().default(true),
  certifications: z.boolean().default(true),
  languages: z.boolean().default(true),
});

// Complete Resume Schema
export const resumeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  slug: z.string(),
  templateId: z.string().default('modern'),
  personalInfo: personalInfoSchema.optional(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  design: designSchema.optional(),
  sectionVisibility: sectionVisibilitySchema,
  isPublic: z.boolean().default(false),
  viewCount: z.number().default(0),
  downloadCount: z.number().default(0),
  lastViewedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript Types
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type Design = z.infer<typeof designSchema>;
export type SectionVisibility = z.infer<typeof sectionVisibilitySchema>;
export type Resume = z.infer<typeof resumeSchema>;

// Editor Section Types
export type EditorSection = 
  | 'personal-info'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom'
  | 'design';

export interface EditorSectionConfig {
  id: EditorSection;
  label: string;
  icon: string;
  order: number;
  draggable: boolean;
}
