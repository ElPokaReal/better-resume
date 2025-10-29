import { NextRequest, NextResponse } from 'next/server';
import { getResumeByIdForPreview } from '@/app/actions/resume';
import { renderToStream } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/resume-pdf';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = await getResumeByIdForPreview(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'CV no encontrado' },
        { status: 404 }
      );
    }

    // Generar el PDF
    // @ts-expect-error - React.createElement type incompatibility with @react-pdf/renderer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = await renderToStream(React.createElement(ResumePDF, { resume }) as any);

    // Convertir stream a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Retornar el PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
