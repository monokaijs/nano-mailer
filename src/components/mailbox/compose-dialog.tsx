"use client"

import { useState, useEffect } from 'react'
import { Email } from '@/lib/types/email'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SendIcon, PaperclipIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ComposeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'new' | 'reply' | 'forward'
  replyToEmail?: Email | null
}

export function ComposeDialog({
  open,
  onOpenChange,
  mode,
  replyToEmail
}: ComposeDialogProps) {
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)

  useEffect(() => {
    if (open) {
      if (mode === 'reply' && replyToEmail) {
        setTo(replyToEmail.from.email)
        setSubject(`Re: ${replyToEmail.subject}`)
        const emailBody = replyToEmail.body || replyToEmail.bodyPlain || replyToEmail.bodyHtml || ''
        setBody(`\n\n---\nOn ${new Date(replyToEmail.timestamp).toLocaleString()}, ${replyToEmail.from.name} wrote:\n${emailBody}`)
      } else if (mode === 'forward' && replyToEmail) {
        setTo('')
        setSubject(`Fwd: ${replyToEmail.subject}`)
        const emailBody = replyToEmail.body || replyToEmail.bodyPlain || replyToEmail.bodyHtml || ''
        setBody(`\n\n---\nForwarded message from ${replyToEmail.from.name}:\n${emailBody}`)
      } else {
        setTo('')
        setSubject('')
        setBody('')
      }
      setCc('')
      setBcc('')
      setShowCc(false)
      setShowBcc(false)
    }
  }, [open, mode, replyToEmail])

  const handleSend = () => {
    if (!to || !subject || !body) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Email sent successfully!')
    onOpenChange(false)
  }

  const handleSaveDraft = () => {
    toast.success('Draft saved')
    onOpenChange(false)
  }

  const getTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Reply'
      case 'forward':
        return 'Forward'
      default:
        return 'New Message'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{getTitle()}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="w-12 shrink-0">To</Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {!showCc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCc(true)}
                    >
                      Cc
                    </Button>
                  )}
                  {!showBcc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBcc(true)}
                    >
                      Bcc
                    </Button>
                  )}
                </div>
              </div>

              {showCc && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="cc" className="w-12 shrink-0">Cc</Label>
                  <Input
                    id="cc"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setShowCc(false)
                      setCc('')
                    }}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              )}

              {showBcc && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="bcc" className="w-12 shrink-0">Bcc</Label>
                  <Input
                    id="bcc"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setShowBcc(false)
                      setBcc('')
                    }}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="subject" className="w-12 shrink-0">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="flex-1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                className="w-full min-h-[300px] p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              <PaperclipIcon className="mr-2 size-4" />
              Attach
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handleSend}>
                <SendIcon className="mr-2 size-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

