"use client"

import { Email } from '@/lib/types/email'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'
import {
  ReplyIcon,
  ReplyAllIcon,
  ForwardIcon,
  TrashIcon,
  StarIcon,
  MailOpenIcon,
  MailIcon,
  MoreVerticalIcon,
  DownloadIcon,
  FileIcon
} from 'lucide-react'
import { format } from 'date-fns'

interface MailboxDetailProps {
  email: Email | null
  onReply: (email: Email, replyAll?: boolean) => void
  onForward: (email: Email) => void
  onDelete: (emailId: string) => void
  onToggleStar: (emailId: string) => void
  onToggleRead: (emailId: string) => void
}

export function MailboxDetail({
  email,
  onReply,
  onForward,
  onDelete,
  onToggleStar,
  onToggleRead
}: MailboxDetailProps) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <MailIcon className="size-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No email selected</p>
          <p className="text-sm mt-1">Select an email to view its contents</p>
        </div>
      </div>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold truncate flex-1">{email.subject}</h2>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onReply(email)}
            >
              <ReplyIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onReply(email, true)}
            >
              <ReplyAllIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onForward(email)}
            >
              <ForwardIcon className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onToggleStar(email.id || email._id || email.messageId)}
            >
              <StarIcon
                className={cn(
                  "size-4",
                  email.starred && "fill-yellow-400 text-yellow-400"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(email.id || email._id || email.messageId)}
            >
              <TrashIcon className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleRead(email.id || email._id || email.messageId)}>
                  {email.read ? (
                    <>
                      <MailIcon className="mr-2 size-4" />
                      Mark as unread
                    </>
                  ) : (
                    <>
                      <MailOpenIcon className="mr-2 size-4" />
                      Mark as read
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="size-12">
              <AvatarFallback>
                {email.from.avatar || email.from.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <p className="font-semibold">{email.from.name}</p>
                  <p className="text-sm text-muted-foreground">{email.from.email}</p>
                </div>
                <p className="text-sm text-muted-foreground shrink-0">
                  {format(new Date(email.timestamp), 'PPp')}
                </p>
              </div>

              <div className="mt-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">To:</span>
                  <span>{email.to.map(t => t.email).join(', ')}</span>
                </div>
                {email.cc && email.cc.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    <span className="text-muted-foreground">Cc:</span>
                    <span>{email.cc.map(c => c.email).join(', ')}</span>
                  </div>
                )}
              </div>

              {email.labels && email.labels.length > 0 && (
                <div className="flex gap-1 mt-3">
                  {email.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{email.body || email.bodyPlain || email.bodyHtml}</div>
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Attachments ({email.attachments.length})
                </h3>
                <div className="space-y-2">
                  {email.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded">
                          <FileIcon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{attachment.name || attachment.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <DownloadIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

