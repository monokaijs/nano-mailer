import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.ATTACHMENT_UPLOAD_DIR || './uploads/attachments';
const SECRET_KEY = process.env.ATTACHMENT_SECRET_KEY || 'change-this-secret-key-in-production';
const URL_EXPIRATION_HOURS = parseInt(process.env.ATTACHMENT_URL_EXPIRATION_HOURS || '24', 10);

export interface AttachmentFile {
  filename: string;
  content: Buffer;
  contentType: string;
  size: number;
}

export interface StoredAttachment {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  storageKey: string;
}

export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw error;
  }
}

export async function saveAttachment(file: AttachmentFile): Promise<StoredAttachment> {
  await ensureUploadDir();

  const id = crypto.randomBytes(16).toString('hex');
  const ext = path.extname(file.filename);
  const storageKey = `${id}${ext}`;
  const filePath = path.join(UPLOAD_DIR, storageKey);

  await fs.writeFile(filePath, file.content);

  return {
    id,
    filename: file.filename,
    size: file.size,
    contentType: file.contentType,
    storageKey,
  };
}

export async function getAttachmentPath(storageKey: string): Promise<string> {
  return path.join(UPLOAD_DIR, storageKey);
}

export async function deleteAttachment(storageKey: string): Promise<void> {
  try {
    const filePath = await getAttachmentPath(storageKey);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Failed to delete attachment:', error);
  }
}

export function generateSignedUrl(attachmentId: string, filename: string): { signedUrl: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + URL_EXPIRATION_HOURS * 60 * 60 * 1000);
  const expiresAtTimestamp = Math.floor(expiresAt.getTime() / 1000);

  const payload = `${attachmentId}:${filename}:${expiresAtTimestamp}`;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex');

  const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
  const signedUrl = `/api/emails/attachments/${attachmentId}?token=${token}`;

  return { signedUrl, expiresAt };
}

export function verifySignedUrl(attachmentId: string, token: string): { valid: boolean; filename?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 4) {
      return { valid: false };
    }

    const [tokenAttachmentId, filename, expiresAtStr, signature] = parts;

    if (tokenAttachmentId !== attachmentId) {
      return { valid: false };
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Math.floor(Date.now() / 1000);

    if (now > expiresAt) {
      return { valid: false };
    }

    const payload = `${tokenAttachmentId}:${filename}:${expiresAtStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return { valid: true, filename };
  } catch (error) {
    console.error('Failed to verify signed URL:', error);
    return { valid: false };
  }
}

export function extractThreadId(headers: Record<string, string>, messageId: string): string {
  const inReplyTo = headers['in-reply-to'] || headers['In-Reply-To'];
  const references = headers['references'] || headers['References'];

  if (inReplyTo) {
    return cleanMessageId(inReplyTo);
  }

  if (references) {
    const refList = references.split(/\s+/).filter(Boolean);
    if (refList.length > 0) {
      return cleanMessageId(refList[0]);
    }
  }

  return cleanMessageId(messageId);
}

export function cleanMessageId(messageId: string): string {
  return messageId.replace(/^<|>$/g, '').trim();
}

export function extractReferences(headers: Record<string, string>): string[] {
  const references = headers['references'] || headers['References'];
  if (!references) {
    return [];
  }

  return references
    .split(/\s+/)
    .filter(Boolean)
    .map(cleanMessageId);
}

export function generatePreview(text: string, maxLength: number = 150): string {
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.substring(0, maxLength).trim() + '...';
}

