import { neon } from '@neondatabase/serverless';

export const config = {
  schedule: '*/5 * * * *', // Cada 5 minutos
};

export default async () => {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Query simple para mantener la conexión activa
    const result = await sql`SELECT 1 as ping`;
    
    console.log('[Keep-Alive] Database ping successful:', new Date().toISOString());
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        timestamp: new Date().toISOString(),
        result: result[0]
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[Keep-Alive] Database ping failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
