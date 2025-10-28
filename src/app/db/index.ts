import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('No existe DATABASE_URL en el archivo .env');
}

// Configurar con timeout más largo y retry
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export const db = drizzle(sql, { schema });
