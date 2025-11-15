"use client"

import { useState } from 'react'
import { Email, MailboxConfig } from '@/lib/types/email'
import { MailboxList } from './mailbox-list'
import { MailboxDetail } from './mailbox-detail'
import { ComposeDialog } from './compose-dialog'
import { cn } from '@/lib/utils/cn'

interface MailboxProps {
  emails: Email[]
  onEmailsChange?: (emails: Email[]) => void
  config?: MailboxConfig
  className?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function Mailbox({
  emails: initialEmails,
  onEmailsChange,
  config,
  className,
  searchQuery = '',
  onSearchChange
}: MailboxProps) {
  const [emails, setEmails] = useState<Email[]>(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | 'forward'>('new')
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null)

  const updateEmails = (newEmails: Email[]) => {
    setEmails(newEmails)
    onEmailsChange?.(newEmails)
  }

  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchQuery === '' ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getEmailId = (email: Email) => email.id || email._id || email.messageId

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    if (!email.read) {
      updateEmails(emails.map(e =>
        getEmailId(e) === getEmailId(email) ? { ...e, read: true } : e
      ))
    }
  }

  const handleToggleStar = (emailId: string) => {
    updateEmails(emails.map(e =>
      getEmailId(e) === emailId ? { ...e, starred: !e.starred } : e
    ))
  }

  const handleToggleRead = (emailId: string) => {
    updateEmails(emails.map(e =>
      getEmailId(e) === emailId ? { ...e, read: !e.read } : e
    ))
  }

  const handleDelete = (emailId: string) => {
    updateEmails(emails.map(e =>
      getEmailId(e) === emailId ? { ...e, folder: 'trash' } : e
    ))
    if (getEmailId(selectedEmail!) === emailId) {
      setSelectedEmail(null)
    }
  }

  const handleCompose = () => {
    setComposeMode('new')
    setReplyToEmail(null)
    setComposeOpen(true)
  }

  const handleReply = (email: Email, replyAll: boolean = false) => {
    setComposeMode(replyAll ? 'reply' : 'reply')
    setReplyToEmail(email)
    setComposeOpen(true)
  }

  const handleForward = (email: Email) => {
    setComposeMode('forward')
    setReplyToEmail(email)
    setComposeOpen(true)
  }

  return (
    <div className={cn("flex flex-1 overflow-hidden", className)}>
      <MailboxList
        emails={filteredEmails}
        selectedEmail={selectedEmail}
        onEmailClick={handleEmailClick}
        onToggleStar={handleToggleStar}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange || (() => {})}
      />

      <MailboxDetail
        email={selectedEmail}
        onReply={handleReply}
        onForward={handleForward}
        onDelete={handleDelete}
        onToggleStar={handleToggleStar}
        onToggleRead={handleToggleRead}
      />

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        mode={composeMode}
        replyToEmail={replyToEmail}
      />
    </div>
  )
}

