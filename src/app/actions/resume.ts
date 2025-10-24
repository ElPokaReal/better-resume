'use server';

import { db } from '@/app/db';
import { resume } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/../auth';
import { headers } from 'next/headers';

export async function getUserResumes() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  const resumes = await db
    .select({
      id: resume.id,
      title: resume.title,
      templateId: resume.templateId,
      updatedAt: resume.updatedAt,
    })
    .from(resume)
    .where(eq(resume.userId, session.user.id))
    .orderBy(desc(resume.updatedAt));

  return resumes;
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
    })
    .returning();

  return newResume;
}
