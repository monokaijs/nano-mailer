"use client"

import { useState, useEffect, useCallback } from 'react'
import { Mailbox } from '@/components/mailbox/mailbox'
import { ComposeDialog } from '@/components/mailbox/compose-dialog'
import { Email } from '@/lib/types/email'
import { mockEmails } from '@/lib/data/mock-emails'
import { useMailContext } from '@/contexts/mail-context'

export default function MailPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [searchQuery, setSearchQuery] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const { selectedFolder, setFolderCounts, setUnreadCount, setOnCompose } = useMailContext()

  const handleCompose = useCallback(() => {
    setComposeOpen(true)
  }, [])

  useEffect(() => {
    setOnCompose(handleCompose)
  }, [handleCompose, setOnCompose])

  useEffect(() => {
    const folderCounts = {
      inbox: emails.filter(e => e.folder === 'inbox').length,
      sent: emails.filter(e => e.folder === 'sent').length,
      drafts: emails.filter(e => e.folder === 'drafts').length,
      trash: emails.filter(e => e.folder === 'trash').length,
      starred: emails.filter(e => e.starred).length,
    }
    const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length

    setFolderCounts(folderCounts)
    setUnreadCount(unreadCount)
  }, [emails, setFolderCounts, setUnreadCount])

  const filteredEmails = emails.filter(email => {
    const matchesFolder = email.folder === selectedFolder ||
      (selectedFolder === 'starred' && email.starred)
    return matchesFolder
  })

  return (
    <>
      <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
        <Mailbox
          emails={filteredEmails}
          onEmailsChange={setEmails}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        mode="new"
        replyToEmail={null}
      />
    </>
  )
}

