"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { MailProvider, useMailContext } from "@/contexts/mail-context"

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMailPage = pathname === '/mail'
  const mailContext = isMailPage ? useMailContext() : null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        showMailNav={isMailPage}
        selectedFolder={mailContext?.selectedFolder}
        onFolderChange={mailContext?.setSelectedFolder}
        folderCounts={mailContext?.folderCounts}
        unreadCount={mailContext?.unreadCount}
        onCompose={mailContext?.onCompose}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <MailProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </MailProvider>
  )
}

