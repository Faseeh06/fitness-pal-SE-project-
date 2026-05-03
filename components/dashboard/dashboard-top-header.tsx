"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import type { FitPalSessionUser } from "@/lib/fitpal-auth"
import { cn } from "@/lib/utils"

function avatarSrc(user: FitPalSessionUser) {
  const seed = encodeURIComponent(user.id || user.email)
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`
}

function UserAvatar({
  user,
  className,
  size = 36,
}: {
  user: FitPalSessionUser
  className?: string
  size?: number
}) {
  const [failed, setFailed] = useState(false)
  const initial = user.name.trim().charAt(0).toUpperCase() || "?"

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white/15 text-sm font-medium text-dashboard-bar-foreground border border-white/20",
          className,
        )}
        aria-hidden
      >
        {initial}
      </div>
    )
  }

  return (
    <Image
      src={avatarSrc(user)}
      alt=""
      width={size}
      height={size}
      className={cn("object-cover bg-white/10 border border-white/15", className)}
      unoptimized
      onError={() => setFailed(true)}
    />
  )
}

export function DashboardTopHeader({
  user,
  mobileMenu,
}: {
  user: FitPalSessionUser
  /** Sheet trigger etc. — only rendered on small screens (caller passes slot). */
  mobileMenu?: ReactNode
}) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-dashboard-bar px-4 py-3 md:px-6 lg:px-8 xl:px-10 md:py-3.5",
        "sticky top-0 z-30",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 md:flex-initial">
        {mobileMenu ? <div className="flex shrink-0 items-center md:hidden">{mobileMenu}</div> : null}
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.22em] uppercase text-dashboard-bar-muted">FitPal</p>
          <p className="truncate text-sm font-medium text-dashboard-bar-foreground">Dashboard</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        <div className="hidden min-w-0 max-w-[220px] text-right sm:block">
          <p className="truncate text-sm text-dashboard-bar-foreground">{user.name}</p>
          <p className="truncate text-[11px] text-dashboard-bar-muted">{user.email}</p>
        </div>
        <Link
          href="/dashboard/profile"
          className="shrink-0 ring-1 ring-white/15 transition-[box-shadow,ring-color] hover:ring-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Profile settings"
        >
          <UserAvatar user={user} size={40} className="h-9 w-9 md:h-10 md:w-10" />
        </Link>
      </div>
    </header>
  )
}
