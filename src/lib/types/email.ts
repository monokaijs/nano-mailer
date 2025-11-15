export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred'

export interface EmailRecipient {
  name: string
  email: string
  avatar?: string
}

export interface EmailAttachment {
  id: string
  filename: string
  name?: string
  size: number
  contentType: string
  type?: string
  storageKey: string
  url?: string
  signedUrl?: string
  expiresAt?: Date
}

export interface Email {
  _id?: string
  id?: string
  messageId: string
  threadId: string
  inReplyTo?: string
  references?: string[]
  from: EmailRecipient
  to: EmailRecipient[]
  cc?: EmailRecipient[]
  bcc?: EmailRecipient[]
  subject: string
  bodyHtml?: string
  bodyPlain: string
  body?: string
  preview: string
  timestamp: Date
  read: boolean
  starred: boolean
  folder: EmailFolder
  attachments?: EmailAttachment[]
  labels?: string[]
  headers?: Record<string, string>
  userId?: string
}

export interface MailboxConfig {
  apiEndpoint?: string
  userEmail?: string
  onEmailAction?: (action: string, emailId: string) => void
}

