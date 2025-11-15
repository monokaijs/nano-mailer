"use client"

import { EmailFolder } from '@/lib/types/email'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { 
  InboxIcon, 
  SendIcon, 
  FileTextIcon, 
  TrashIcon, 
  StarIcon,
  PencilIcon
} from 'lucide-react'

interface MailboxSidebarProps {
  selectedFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  folderCounts: Record<EmailFolder, number>
  unreadCount: number
  onCompose: () => void
}

const folderConfig = [
  { id: 'inbox' as EmailFolder, label: 'Inbox', icon: InboxIcon },
  { id: 'starred' as EmailFolder, label: 'Starred', icon: StarIcon },
  { id: 'sent' as EmailFolder, label: 'Sent', icon: SendIcon },
  { id: 'drafts' as EmailFolder, label: 'Drafts', icon: FileTextIcon },
  { id: 'trash' as EmailFolder, label: 'Trash', icon: TrashIcon },
]

export function MailboxSidebar({
  selectedFolder,
  onFolderChange,
  folderCounts,
  unreadCount,
  onCompose
}: MailboxSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <Button 
          onClick={onCompose}
          className="w-full"
          size="lg"
        >
          <PencilIcon className="mr-2" />
          Compose
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {folderConfig.map((folder) => {
          const Icon = folder.icon
          const count = folderCounts[folder.id]
          const isSelected = selectedFolder === folder.id
          const showUnread = folder.id === 'inbox' && unreadCount > 0

          return (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4" />
                <span>{folder.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {showUnread && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full font-semibold",
                    isSelected 
                      ? "bg-primary-foreground text-primary" 
                      : "bg-primary text-primary-foreground"
                  )}>
                    {unreadCount}
                  </span>
                )}
                {count > 0 && !showUnread && (
                  <span className="text-xs text-muted-foreground">
                    {count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

