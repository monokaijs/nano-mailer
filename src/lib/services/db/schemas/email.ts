import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Email, EmailRecipient, EmailAttachment, EmailFolder } from '@/lib/types/email';

const EmailRecipientSchema = new mongoose.Schema<EmailRecipient>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
}, { _id: false });

const EmailAttachmentSchema = new mongoose.Schema<EmailAttachment>({
  id: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  storageKey: {
    type: String,
    required: true,
  },
  signedUrl: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
}, { _id: false });

export const EmailSchema = new mongoose.Schema<Email>({
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  threadId: {
    type: String,
    required: true,
    index: true,
  },
  inReplyTo: {
    type: String,
    required: false,
    index: true,
  },
  references: {
    type: [String],
    default: [],
  },
  from: {
    type: EmailRecipientSchema,
    required: true,
  },
  to: {
    type: [EmailRecipientSchema],
    required: true,
    validate: {
      validator: function(v: EmailRecipient[]) {
        return v && v.length > 0;
      },
      message: 'At least one recipient is required',
    },
  },
  cc: {
    type: [EmailRecipientSchema],
    default: [],
  },
  bcc: {
    type: [EmailRecipientSchema],
    default: [],
  },
  subject: {
    type: String,
    required: true,
    default: '(No Subject)',
  },
  bodyHtml: {
    type: String,
    required: false,
  },
  bodyPlain: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  starred: {
    type: Boolean,
    default: false,
    index: true,
  },
  folder: {
    type: String,
    enum: ['inbox', 'sent', 'drafts', 'trash', 'starred'] as EmailFolder[],
    default: 'inbox',
    index: true,
  },
  attachments: {
    type: [EmailAttachmentSchema],
    default: [],
  },
  labels: {
    type: [String],
    default: [],
  },
  headers: {
    type: Map,
    of: String,
    default: {},
  },
  userId: {
    type: String,
    required: false,
    index: true,
  },
}, {
  timestamps: true,
});

EmailSchema.index({ threadId: 1, timestamp: -1 });
EmailSchema.index({ userId: 1, folder: 1, timestamp: -1 });
EmailSchema.index({ userId: 1, read: 1 });
EmailSchema.index({ 'from.email': 1 });
EmailSchema.index({ 'to.email': 1 });

EmailSchema.plugin(mongoosePaginate);

