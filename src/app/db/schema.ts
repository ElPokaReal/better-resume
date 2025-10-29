import { pgTable, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabla de usuarios
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Tabla de sesiones
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// Tabla de cuentas (para OAuth providers)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Tabla de verificación (para emails, etc.)
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Tabla de currículums/resumes
export const resume = pgTable('resume', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  templateId: text('templateId').notNull().default('modern'),
  
  // Información personal
  personalInfo: jsonb('personalInfo').$type<{
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    profileImage?: string;
  }>(),
  
  // Experiencia laboral
  experience: jsonb('experience').$type<Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements?: string[];
  }>>().default([]),
  
  // Educación
  education: jsonb('education').$type<Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>>().default([]),
  
  // Habilidades
  skills: jsonb('skills').$type<Array<{
    id: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category?: string;
  }>>().default([]),
  
  // Proyectos
  projects: jsonb('projects').$type<Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
    github?: string;
    startDate?: string;
    endDate?: string;
    technologies?: string[];
  }>>().default([]),
  
  // Certificaciones
  certifications: jsonb('certifications').$type<Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>>().default([]),
  
  // Idiomas
  languages: jsonb('languages').$type<Array<{
    id: string;
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>>().default([]),
  
  // Secciones personalizadas
  customSections: jsonb('customSections').$type<Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>>().default([]),
  
  // Configuración de diseño
  design: jsonb('design').$type<{
    colorScheme?: string;
    fontFamily?: string;
    fontSize?: number;
    spacing?: 'compact' | 'normal' | 'relaxed';
    accentColor?: string;
    layout?: 'single-column' | 'two-column' | 'sidebar';
  }>(),
  
  // Configuración de visibilidad de secciones
  sectionVisibility: jsonb('sectionVisibility').$type<{
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
  }>().default({
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  }),
  
  // Metadata
  isPublic: boolean('isPublic').notNull().default(false),
  isFavorite: boolean('isFavorite').notNull().default(false),
  viewCount: integer('viewCount').notNull().default(0),
  downloadCount: integer('downloadCount').notNull().default(0),
  lastViewedAt: timestamp('lastViewedAt'),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Relaciones
export const userRelations = relations(user, ({ many }) => ({
  resumes: many(resume),
}));

export const resumeRelations = relations(resume, ({ one }) => ({
  user: one(user, {
    fields: [resume.userId],
    references: [user.id],
  }),
}));
