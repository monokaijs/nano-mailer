import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbService } from '@/lib/services/db';
import { Email, EmailRecipient } from '@/lib/types/email';
import {
  saveAttachment,
  generateSignedUrl,
  extractThreadId,
  cleanMessageId,
  extractReferences,
  generatePreview,
  AttachmentFile,
} from '@/lib/utils/attachment';

const MAILGUN_SIGNING_KEY = process.env.MAILGUN_SIGNING_KEY || '';

interface MailgunWebhookPayload {
  signature: {
    timestamp: string;
    token: string;
    signature: string;
  };
  'event-data': {
    message: {
      headers: {
        'message-id': string;
        from: string;
        to: string;
        subject: string;
        'in-reply-to'?: string;
        references?: string;
        [key: string]: string | undefined;
      };
      attachments?: Array<{
        filename: string;
        'content-type': string;
        size: number;
        url: string;
      }>;
    };
    'body-plain'?: string;
    'body-html'?: string;
    'stripped-text'?: string;
    'stripped-html'?: string;
  };
}

function verifyMailgunSignature(timestamp: string, token: string, signature: string): boolean {
  if (!MAILGUN_SIGNING_KEY) {
    console.warn('MAILGUN_SIGNING_KEY not configured, skipping signature verification');
    return true;
  }

  const encodedToken = crypto
    .createHmac('sha256', MAILGUN_SIGNING_KEY)
    .update(timestamp + token)
    .digest('hex');

  return encodedToken === signature;
}

function parseEmailAddress(address: string): EmailRecipient {
  const match = address.match(/^(?:"?([^"]*)"?\s)?<?([^>]+)>?$/);
  if (match) {
    const name = match[1]?.trim() || match[2].split('@')[0];
    const email = match[2].trim();
    return { name, email };
  }
  return { name: address.split('@')[0], email: address };
}

function parseEmailAddresses(addresses: string): EmailRecipient[] {
  return addresses
    .split(',')
    .map(addr => addr.trim())
    .filter(Boolean)
    .map(parseEmailAddress);
}

async function downloadAttachment(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY || ''}`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download attachment: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MailgunWebhookPayload;

    const { timestamp, token, signature } = body.signature;
    if (!verifyMailgunSignature(timestamp, token, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const eventData = body['event-data'];
    const message = eventData.message;
    const headers = message.headers;

    const headersRecord: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        headersRecord[key] = value;
      }
    }

    const messageId = cleanMessageId(headers['message-id']);
    const threadId = extractThreadId(headersRecord, messageId);
    const inReplyTo = headers['in-reply-to'] ? cleanMessageId(headers['in-reply-to']) : undefined;
    const references = extractReferences(headersRecord);

    const from = parseEmailAddress(headers.from);
    const to = parseEmailAddresses(headers.to);
    const cc = headers.cc ? parseEmailAddresses(headers.cc) : [];
    const bcc = headers.bcc ? parseEmailAddresses(headers.bcc) : [];

    const bodyPlain = eventData['stripped-text'] || eventData['body-plain'] || '';
    const bodyHtml = eventData['stripped-html'] || eventData['body-html'];
    const preview = generatePreview(bodyPlain);

    const attachments = [];
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        try {
          const content = await downloadAttachment(attachment.url);

          const attachmentFile: AttachmentFile = {
            filename: attachment.filename,
            content,
            contentType: attachment['content-type'],
            size: attachment.size,
          };

          const stored = await saveAttachment(attachmentFile);
          const { signedUrl, expiresAt } = generateSignedUrl(stored.id, stored.filename);

          attachments.push({
            id: stored.id,
            filename: stored.filename,
            size: stored.size,
            contentType: stored.contentType,
            storageKey: stored.storageKey,
            signedUrl,
            expiresAt,
          });
        } catch (error) {
          console.error('Failed to process attachment:', error);
        }
      }
    }

    await dbService.connect();

    const email: Omit<Email, '_id'> = {
      messageId,
      threadId,
      inReplyTo,
      references,
      from,
      to,
      cc: cc.length > 0 ? cc : undefined,
      bcc: bcc.length > 0 ? bcc : undefined,
      subject: headers.subject || '(No Subject)',
      bodyHtml,
      bodyPlain,
      preview,
      timestamp: new Date(),
      read: false,
      starred: false,
      folder: 'inbox',
      attachments: attachments.length > 0 ? attachments : undefined,
      labels: [],
      headers: headersRecord,
    };

    const savedEmail = await dbService.email.create(email);

    return NextResponse.json(
      {
        success: true,
        emailId: savedEmail._id,
        threadId: savedEmail.threadId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Mailgun webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

