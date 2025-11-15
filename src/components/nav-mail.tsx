"use client"

import { EmailFolder } from '@/lib/types/email'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  IconInbox,
  IconSend,
  IconFile,
  IconTrash,
  IconStar,
  IconBox,
  IconPencil
} from '@tabler/icons-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavMailProps {
  selectedFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  folderCounts: {
    inbox: number
    sent: number
    drafts: number
    trash: number
    starred: number
  }
  unreadCount: number
  onCompose?: () => void
}

const folders = [
  { id: 'inbox' as EmailFolder, label: 'Inbox', icon: IconInbox },
  { id: 'starred' as EmailFolder, label: 'Starred', icon: IconStar },
  { id: 'sent' as EmailFolder, label: 'Sent', icon: IconSend },
  { id: 'drafts' as EmailFolder, label: 'Drafts', icon: IconFile },
  { id: 'trash' as EmailFolder, label: 'Trash', icon: IconTrash },
]

export function NavMail({
  selectedFolder,
  onFolderChange,
  folderCounts,
  unreadCount,
  onCompose,
}: NavMailProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Mail</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {onCompose && (
            <SidebarMenuItem>
              <Button
                onClick={onCompose}
                className="w-full justify-start gap-2 mb-2"
                size="sm"
              >
                <IconPencil className="size-4" />
                Compose
              </Button>
            </SidebarMenuItem>
          )}
          {folders.map((folder) => {
            const count = folder.id === 'starred' 
              ? folderCounts.starred 
              : folderCounts[folder.id]
            const isActive = selectedFolder === folder.id
            const showBadge = folder.id === 'inbox' ? unreadCount > 0 : count > 0

            return (
              <SidebarMenuItem key={folder.id}>
                <SidebarMenuButton
                  onClick={() => onFolderChange(folder.id)}
                  isActive={isActive}
                  tooltip={folder.label}
                >
                  <folder.icon />
                  <span>{folder.label}</span>
                  {showBadge && (
                    <Badge 
                      variant={folder.id === 'inbox' && unreadCount > 0 ? 'default' : 'secondary'}
                      className="ml-auto"
                    >
                      {folder.id === 'inbox' ? unreadCount : count}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function NavMailCollapsed({
  selectedFolder,
  onFolderChange,
  folderCounts,
  unreadCount,
  onCompose,
}: NavMailProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:block hidden">
      <SidebarGroupContent>
        <SidebarMenu>
          {onCompose && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onCompose}
                tooltip="Compose"
              >
                <IconPencil />
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {folders.map((folder) => {
            const count = folder.id === 'starred'
              ? folderCounts.starred
              : folderCounts[folder.id]
            const isActive = selectedFolder === folder.id

            return (
              <SidebarMenuItem key={folder.id}>
                <SidebarMenuButton
                  onClick={() => onFolderChange(folder.id)}
                  isActive={isActive}
                  tooltip={folder.label}
                >
                  <folder.icon />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

