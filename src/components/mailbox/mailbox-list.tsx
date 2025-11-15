"use client"

import { Email } from '@/lib/types/email'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'
import { SearchIcon, StarIcon, PaperclipIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MailboxListProps {
  emails: Email[]
  selectedEmail: Email | null
  onEmailClick: (email: Email) => void
  onToggleStar: (emailId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function MailboxList({
  emails,
  selectedEmail,
  onEmailClick,
  onToggleStar,
  searchQuery,
  onSearchChange
}: MailboxListProps) {
  return (
    <div className="w-96 border-r flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">No emails found</p>
              <p className="text-sm mt-1">
                {searchQuery ? 'Try a different search term' : 'This folder is empty'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {emails.map((email) => (
              <EmailListItem
                key={email.id || email._id || email.messageId}
                email={email}
                isSelected={selectedEmail?.id === (email.id || email._id || email.messageId)}
                onClick={() => onEmailClick(email)}
                onToggleStar={(e) => {
                  e.stopPropagation()
                  onToggleStar(email.id || email._id || email.messageId)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onClick: () => void
  onToggleStar: (e: React.MouseEvent) => void
}

function EmailListItem({ email, isSelected, onClick, onToggleStar }: EmailListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "bg-accent",
        !email.read && "bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="text-xs">
            {email.from.avatar || email.from.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm truncate",
                !email.read && "font-semibold"
              )}>
                {email.from.name}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleStar}
                className="hover:bg-accent rounded p-1 transition-colors"
              >
                <StarIcon
                  className={cn(
                    "size-4",
                    email.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={cn(
              "text-sm truncate flex-1",
              !email.read && "font-semibold"
            )}>
              {email.subject}
            </h3>
            {email.attachments && email.attachments.length > 0 && (
              <PaperclipIcon className="size-3 text-muted-foreground shrink-0" />
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mb-2">
            {email.preview}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              {email.labels?.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

