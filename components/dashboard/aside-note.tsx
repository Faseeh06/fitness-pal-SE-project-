import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Info } from "lucide-react"

export function AsideNote({
  icon: Icon = Info,
  children,
}: {
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <aside className="flex gap-3 border border-border bg-secondary/40 px-4 py-4 md:px-5 md:py-5">
      <Icon className="h-4 w-4 shrink-0 text-foreground/35 mt-0.5" strokeWidth={1.5} />
      <div className="min-w-0 text-xs text-muted-foreground leading-snug space-y-2">{children}</div>
    </aside>
  )
}
