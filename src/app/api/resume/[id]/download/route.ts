import { NextRequest, NextResponse } from 'next/server';
import { getResumeByIdForPreview } from '@/app/actions/resume';
import { renderToStream } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/resume-pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resume = await getResumeByIdForPreview(params.id);

    if (!resume) {
      return NextResponse.json(
        { error: 'CV no encontrado' },
        { status: 404 }
      );
    }

    // Generar el PDF
    const stream = await renderToStream(<ResumePDF resume={resume} />);

    // Convertir stream a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
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
