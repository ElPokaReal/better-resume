import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Query simple para mantener la conexión activa
    const startTime = Date.now();
    const result = await sql`SELECT 1 as ping, NOW() as timestamp`;
    const duration = Date.now() - startTime;
    
    console.log('[Keep-Alive] Database ping successful:', {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      dbTimestamp: result[0].timestamp,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Database is alive',
      timestamp: new Date().toISOString(),
      dbTimestamp: result[0].timestamp,
      duration: `${duration}ms`,
      ping: result[0].ping,
    });
  } catch (error) {
    console.error('[Keep-Alive] Database ping failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Database ping failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
