"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  Apple,
  Calendar,
  ChevronRight,
  Dumbbell,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react"

import { DashboardUserProvider } from "@/components/dashboard/dashboard-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { FitPalSessionUser } from "@/lib/fitpal-auth"
import { FITPAL_SESSION_UPDATED_EVENT, getSession, signOut } from "@/lib/fitpal-auth"
import { dashboardMainClassName } from "@/lib/dashboard-layout"
import { bootstrapDemoFitnessData } from "@/lib/fitpal-workouts"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/nutrition", label: "Nutrition", icon: Apple },
  { href: "/dashboard/hydration", label: "Hydration", icon: Droplets },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/ai", label: "AI suggestions", icon: Sparkles },
] as const

function NavLink({
  href,
  label,
  icon: Icon,
  onNavigate,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onNavigate?: () => void
  active: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 text-[13px] tracking-tight transition-colors border border-transparent border-l-2",
        active
          ? "bg-secondary text-foreground border-border border-l-foreground/25"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border-l-transparent",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" />
      <span className="flex-1">{label}</span>
      <ChevronRight
        className={cn(
          "h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity",
          active ? "opacity-40" : "group-hover:opacity-30",
        )}
      />
    </Link>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<FitPalSessionUser | null | undefined>(undefined)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace("/login")
      return
    }
    bootstrapDemoFitnessData(session.id)
    setUser(session)
  }, [router])

  useEffect(() => {
    function onSessionUpdated() {
      const next = getSession()
      if (next) setUser(next)
    }
    window.addEventListener(FITPAL_SESSION_UPDATED_EVENT, onSessionUpdated)
    return () => window.removeEventListener(FITPAL_SESSION_UPDATED_EVENT, onSessionUpdated)
  }, [])

  function handleLogout() {
    signOut()
    router.push("/login")
    router.refresh()
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground tracking-wide">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "?"

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-6 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-foreground text-background text-sm font-medium"
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 pt-0.5">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="text-[11px] font-medium tracking-[0.28em] uppercase text-foreground block"
          >
            FitPal
          </Link>
          <p className="text-xs text-muted-foreground mt-1.5 leading-snug truncate">{user.name}</p>
        </div>
      </div>
      <Separator className="mb-4" />
      <nav className="flex flex-1 flex-col gap-0.5 px-1">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              onNavigate={onNavigate}
              active={active}
            />
          )
        })}
      </nav>
      <Separator className="my-4" />
      <div className="mt-auto space-y-1 px-1">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Activity className="h-4 w-4" />
          Marketing site
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.()
            handleLogout()
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <DashboardUserProvider user={user}>
      <div className="min-h-screen flex bg-background">
        <aside className="hidden md:flex w-[260px] shrink-0 border-r border-border flex-col py-8 px-4 bg-card/50">
          {sidebar()}
        </aside>

        <div className="flex flex-1 flex-col min-w-0">
          <header className="flex md:hidden h-14 items-center justify-between border-b border-border px-4 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-none" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 border-border rounded-none">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex h-full flex-col py-8 px-4">{sidebar(() => setMobileOpen(false))}</div>
                </SheetContent>
              </Sheet>
              <span className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
                FitPal
              </span>
            </div>
          </header>

          <main className={dashboardMainClassName}>{children}</main>
        </div>
      </div>
    </DashboardUserProvider>
  )
}
