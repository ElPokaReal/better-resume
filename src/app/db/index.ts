import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('No existe DATABASE_URL en el archivo .env');
}

// Configurar Neon con timeout aumentado para manejar DB pausada
// Neon free tier pausa la DB después de inactividad, toma ~10-15s despertar
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
  fullResults: true, // Obtener metadatos completos
});

export const db = drizzle(sql, { schema });
