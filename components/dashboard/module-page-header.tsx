import type { LucideIcon } from "lucide-react"

export function ModulePageHeader({
  title,
  description,
  kicker = "Module",
  icon: Icon,
}: {
  title: string
  description?: string
  kicker?: string
  icon?: LucideIcon
}) {
  return (
    <header className="mb-9 md:mb-11 pb-7 md:pb-8 border-b border-border">
      <div className="flex gap-4 md:gap-5">
        <div
          className="w-0.5 shrink-0 rounded-full bg-dashboard-bar/35 self-stretch min-h-[3.25rem]"
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
          {Icon ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-secondary text-foreground/80">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">
              {kicker}
            </p>
            <h1 className="text-2xl md:text-[2.1rem] font-extralight tracking-tight text-balance">
              {title}
            </h1>
            {description ? (
              <p className="text-xs md:text-[13px] text-muted-foreground max-w-lg leading-snug mt-2.5 md:mt-3">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
