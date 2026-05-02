"use client"

import Link from "next/link"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const stats = [
  { value: "01", label: "Auth & profile (demo)" },
  { value: "08+", label: "Planned modules (Readme)" },
  { value: "LS", label: "localStorage storage" },
]

export function StudioSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section id="studio" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-foreground text-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
        <div
          ref={headRef}
          className={`transition-all duration-1000 ${
            headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-background/40 mb-8">
            About FitPal
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extralight leading-[1.15] tracking-tight text-balance">
            One flow from signup to dashboard — workouts, nutrition, hydration, and insights
          </h2>
        </div>

        <div
          ref={bodyRef}
          className={`flex flex-col justify-end gap-10 transition-all duration-1000 delay-200 ${
            bodyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col gap-6 max-w-lg">
            <p className="text-sm leading-[1.75] text-background/55">
              FitPal is being built to match the course requirements: authentication, a central
              dashboard, specialized modules, schedule, profile, and an AI assistant that suggests
              workouts and meals using simple rule-based logic (weight loss vs muscle gain).
            </p>
            <p className="text-sm leading-[1.75] text-background/55">
              This milestone wires up signup and login with{" "}
              <span className="text-background/80">localStorage</span> only — no backend yet — so you
              can iterate on UI and flows safely before plugging in Firebase or Node later.
            </p>
            <p className="text-sm leading-[1.75] text-background/55">
              <Link
                href="/signup"
                className="border-b border-background/30 pb-0.5 hover:border-background/60 transition-colors"
              >
                Create a demo account
              </Link>
              {" · "}
              <Link
                href="/login"
                className="border-b border-background/30 pb-0.5 hover:border-background/60 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-background/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extralight text-background tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] tracking-[0.1em] uppercase text-background/35 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
