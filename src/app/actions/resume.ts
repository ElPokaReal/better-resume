'use server';

import { db } from '@/app/db';
import { resume } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '../../../auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
// Cache en memoria para reducir llamadas a DB
// Solo cachea durante la sesión del servidor (se reinicia con cada deploy)
const resumeCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30000; // 30 segundos

// Helper para limpiar cache expirado
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of resumeCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      resumeCache.delete(key);
    }
  }
}

// Helper para retry con backoff exponencial (maneja timeouts de Neon)
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      
      // Solo reintentar en errores de timeout/conexión
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as { code?: string })?.code;
      
      const isRetryable = 
        errorMessage.includes('timeout') ||
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorCode === 'NeonDbError';
      
      if (!isRetryable || i === maxRetries - 1) {
        throw error;
      }
      
      // Backoff exponencial: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function getUserResumes() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  // Solo campos necesarios para el dashboard (placeholder preview)
  const resumes = await db
    .select({
      id: resume.id,
      title: resume.title,
      templateId: resume.templateId,
      updatedAt: resume.updatedAt,
      createdAt: resume.createdAt,
      design: resume.design, // Solo para colores del placeholder
      isPublic: resume.isPublic,
      isFavorite: resume.isFavorite,
    })
    .from(resume)
    .where(eq(resume.userId, session.user.id))
    .orderBy(desc(resume.updatedAt));

  return resumes;
}

export async function toggleResumePublic(id: string) {
  'use server';
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  // Obtener el resume actual
  const [currentResume] = await db
    .select({ isPublic: resume.isPublic })
    .from(resume)
    .where(eq(resume.id, id))
    .limit(1);

  if (!currentResume) {
    throw new Error('CV no encontrado');
  }

  // Toggle isPublic
  await db
    .update(resume)
    .set({ 
      isPublic: !currentResume.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(resume.id, id));

  return !currentResume.isPublic;
}

export async function toggleResumeFavorite(id: string) {
  'use server';
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  // Obtener el resume actual
  const [currentResume] = await db
    .select({ isFavorite: resume.isFavorite })
    .from(resume)
    .where(eq(resume.id, id))
    .limit(1);

  if (!currentResume) {
    throw new Error('CV no encontrado');
  }

  // Toggle isFavorite
  await db
    .update(resume)
    .set({ 
      isFavorite: !currentResume.isFavorite,
      updatedAt: new Date(),
    })
    .where(eq(resume.id, id));

  return !currentResume.isFavorite;
}

export async function duplicateResume(id: string) {
  'use server';
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  // Obtener el resume original
  const [original] = await db
    .select()
    .from(resume)
    .where(eq(resume.id, id))
    .limit(1);

  if (!original) {
    throw new Error('CV no encontrado');
  }

  // Crear copia
  const newId = crypto.randomUUID();
  const newSlug = `${original.slug}-copia-${Date.now()}`;
  const [newResume] = await db
    .insert(resume)
    .values({
      id: newId,
      userId: session.user.id,
      title: `${original.title} (Copia)`,
      slug: newSlug,
      templateId: original.templateId,
      personalInfo: original.personalInfo,
      experience: original.experience,
      education: original.education,
      skills: original.skills,
      projects: original.projects,
      certifications: original.certifications,
      languages: original.languages,
      customSections: original.customSections,
      design: original.design,
      sectionVisibility: original.sectionVisibility,
      isPublic: false, // Siempre privado al duplicar
    })
    .returning();

  // Revalidar la página del dashboard
  revalidatePath('/dashboard');

  return newResume;
}

export async function deleteResume(id: string) {
  'use server';
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  // Verificar que el resume pertenece al usuario
  const [existing] = await db
    .select({ userId: resume.userId })
    .from(resume)
    .where(eq(resume.id, id))
    .limit(1);

  if (!existing || existing.userId !== session.user.id) {
    throw new Error('No autorizado');
  }

  // Eliminar
  await db.delete(resume).where(eq(resume.id, id));

  // Revalidar la página del dashboard
  revalidatePath('/dashboard');

  return true;
}

export async function getResumeById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const [resumeData] = await db
    .select()
    .from(resume)
    .where(eq(resume.id, id))
    .limit(1);

  // Verificar que el resume pertenece al usuario
  if (resumeData?.userId !== session.user.id) {
    return null;
  }

  return resumeData;
}

export async function getResumeByIdForPreview(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const [resumeData] = await db
      .select()
      .from(resume)
      .where(eq(resume.id, id))
      .limit(1);

    if (!resumeData) {
      return null;
    }

    // Si hay sesión, verificar que pertenece al usuario
    // Si no hay sesión, solo mostrar si es público
    if (session?.user?.id) {
      // Usuario autenticado: puede ver sus propios CVs
      if (resumeData.userId === session.user.id) {
        return resumeData;
      }
    }

    // Sin sesión o no es el dueño: solo mostrar si es público
    if (resumeData.isPublic) {
      return resumeData;
    }

    return null;
  } catch (error) {
    console.error('Error in getResumeByIdForPreview:', error);
    throw error;
  }
}

export async function createResume(title: string = 'Nuevo Currículum') {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  const { nanoid } = await import('nanoid');
  const newResumeId = nanoid();
  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + newResumeId.slice(0, 6);

  const [newResume] = await db
    .insert(resume)
    .values({
      id: newResumeId,
      userId: session.user.id,
      title,
      slug,
      templateId: 'modern',
      isPublic: false,
      viewCount: 0,
      downloadCount: 0,
      design: {
        layout: 'single-column',
        colorScheme: 'blue',
        fontFamily: 'Inter',
        fontSize: 11,
        spacing: 'normal',
      },
      sectionVisibility: {
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
      },
    })
    .returning();

  return newResume;
}

export async function updateResume(id: string, data: Partial<typeof resume.$inferInsert>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  // Verificar cache primero para evitar query innecesaria
  const cacheKey = `resume-owner-${id}-${session.user.id}`;
  const cached = resumeCache.get(cacheKey);
  const now = Date.now();
  
  let isOwner = false;
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    // Usar cache
    isOwner = cached.data as boolean;
  } else {
    // Verificar ownership en DB (query mínima)
    const [existingResume] = await db
      .select({ userId: resume.userId })
      .from(resume)
      .where(eq(resume.id, id))
      .limit(1);

    if (!existingResume) {
      throw new Error('CV no encontrado');
    }
    
    isOwner = existingResume.userId === session.user.id;
    
    // Guardar en cache
    resumeCache.set(cacheKey, { data: isOwner, timestamp: now });
  }

  if (!isOwner) {
    throw new Error('No autorizado');
  }

  // Actualizar el resume con retry logic
  const updatedResume = await retryWithBackoff(async () => {
    const [result] = await db
      .update(resume)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(resume.id, id))
      .returning();
    return result;
  });

  // Invalidar cache del resume completo
  resumeCache.delete(`resume-${id}`);
  
  // Limpiar cache expirado
  cleanExpiredCache();

  return updatedResume;
}
