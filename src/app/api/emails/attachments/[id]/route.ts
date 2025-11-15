import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { verifySignedUrl, getAttachmentPath } from '@/lib/utils/attachment';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attachmentId } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }

    const verification = verifySignedUrl(attachmentId, token);

    if (!verification.valid || !verification.filename) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    const filePath = await getAttachmentPath(`${attachmentId}${getFileExtension(verification.filename)}`);

    try {
      const stats = await stat(filePath);

      if (!stats.isFile()) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }

      const stream = createReadStream(filePath);
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);

      const contentType = getContentType(verification.filename);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${verification.filename}"`,
          'Content-Length': stats.size.toString(),
          'Cache-Control': 'private, max-age=3600',
        },
      });
    } catch (error) {
      console.error('File read error:', error);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Attachment download error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    json: 'application/json',
    xml: 'application/xml',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

