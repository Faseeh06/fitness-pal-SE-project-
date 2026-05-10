"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import type { FitPalSessionUser } from "@/lib/fitpal-auth"
import { cn } from "@/lib/utils"

function avatarSrc(user: FitPalSessionUser) {
  const seed = encodeURIComponent(user.id || user.email)
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`
}

function UserAvatar({
  user,
  className,
  size = 40,
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
          "flex items-center justify-center text-sm font-medium border",
          "bg-secondary text-foreground border-border",
          "dark:bg-zinc-900 dark:text-zinc-100 dark:border-white/15",
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
      className={cn(
        "object-cover border bg-muted/50 border-border",
        "dark:bg-zinc-900 dark:border-white/15",
        className,
      )}
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
  mobileMenu?: ReactNode
}) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8 xl:px-10 md:py-3.5",
        "bg-transparent text-foreground border-none",
      )}
    >




      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 md:flex-initial">
        {mobileMenu ? <div className="flex shrink-0 items-center md:hidden">{mobileMenu}</div> : null}
      </div>



      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <ThemeToggle className="text-foreground dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10" />
        <div className="hidden min-w-0 max-w-[200px] text-right sm:block md:max-w-[220px]">
          <p className="truncate text-sm">{user.name}</p>
          <p className="truncate text-[11px] text-muted-foreground dark:text-zinc-400">{user.email}</p>
        </div>
        <Link
          href="/dashboard/profile"
          className={cn(
            "shrink-0 ring-1 transition-[box-shadow,ring-color] focus-visible:outline-none focus-visible:ring-2",
            "ring-zinc-300/80 hover:ring-zinc-400/90 focus-visible:ring-zinc-500",
            "dark:ring-white/15 dark:hover:ring-white/30 dark:focus-visible:ring-white/40",
          )}
          aria-label="Profile settings"
        >
          <UserAvatar user={user} size={40} className="h-9 w-9 md:h-10 md:w-10" />
        </Link>
      </div>
    </header>
  )
}
