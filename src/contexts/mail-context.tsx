"use client"

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react'
import { EmailFolder } from '@/lib/types/email'

interface MailContextType {
  selectedFolder: EmailFolder
  setSelectedFolder: (folder: EmailFolder) => void
  folderCounts: {
    inbox: number
    sent: number
    drafts: number
    trash: number
    starred: number
  }
  setFolderCounts: (counts: {
    inbox: number
    sent: number
    drafts: number
    trash: number
    starred: number
  }) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  onCompose?: () => void
  setOnCompose: (fn: () => void) => void
}

const MailContext = createContext<MailContextType | undefined>(undefined)

export function MailProvider({ children }: { children: ReactNode }) {
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>('inbox')
  const [folderCounts, setFolderCounts] = useState({
    inbox: 0,
    sent: 0,
    drafts: 0,
    trash: 0,
    starred: 0,
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const onComposeRef = useRef<(() => void) | undefined>(undefined)

  const setOnCompose = useCallback((fn: () => void) => {
    onComposeRef.current = fn
  }, [])

  const onCompose = useCallback(() => {
    onComposeRef.current?.()
  }, [])

  return (
    <MailContext.Provider
      value={{
        selectedFolder,
        setSelectedFolder,
        folderCounts,
        setFolderCounts,
        unreadCount,
        setUnreadCount,
        onCompose,
        setOnCompose,
      }}
    >
      {children}
    </MailContext.Provider>
  )
}

export function useMailContext() {
  const context = useContext(MailContext)
  if (context === undefined) {
    throw new Error('useMailContext must be used within a MailProvider')
  }
  return context
}

