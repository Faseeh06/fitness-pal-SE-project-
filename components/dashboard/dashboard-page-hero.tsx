import Image from "next/image"
import type { ReactNode } from "react"

import { dashboardHeroInset } from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

export const DEFAULT_DASHBOARD_HERO_IMAGE =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"

type DashboardPageHeroProps = {
  kicker: string
  title: string
  description: string
  /** Hero background (gym / workout imagery). */
  imageSrc?: string
  priority?: boolean
  /** Optional row above the title (e.g. category badges on workout detail). */
  lead?: ReactNode
  /** Optional row below the description (e.g. duration / kcal). */
  footer?: ReactNode
  className?: string
}

/**
 * Cinematic page hero — dark gradient over imagery with light type (matches dashboard overview).
 * Uses horizontal inset so the band sits slightly inside the main column.
 */
export function DashboardPageHero({
  kicker,
  title,
  description,
  imageSrc = DEFAULT_DASHBOARD_HERO_IMAGE,
  priority = false,
  lead,
  footer,
  className,
}: DashboardPageHeroProps) {
  return (
    <section
      className={cn(
        "relative mb-8 overflow-hidden border border-white/10 md:mb-10",
        dashboardHeroInset,
        className,
      )}
    >
      <div className="relative h-[188px] md:h-[228px] lg:h-[240px]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
          priority={priority}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_transparent_15%,_rgba(0,0,0,0.82)_72%)]" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 py-7 md:px-9 md:py-9 lg:px-11 lg:py-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-white/65">
            {kicker}
          </p>
          {lead ? <div className="mb-3 flex flex-wrap items-center gap-2">{lead}</div> : null}
          <h1 className="max-w-3xl text-balance text-3xl font-extralight tracking-tight text-white md:text-[2.55rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-snug text-white/72 md:max-w-2xl">{description}</p>
          {footer ? <div className="mt-6 md:mt-7">{footer}</div> : null}
        </div>
      </div>
    </section>
  )
}
