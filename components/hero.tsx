"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Hero() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Athlete training in a minimal gym environment"
          className={`w-full h-full object-cover transition-transform duration-[2s] ease-out ${
            visible ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 px-6 pb-16 md:px-12 lg:px-20 md:pb-20">
        <div className="max-w-5xl">
          <div
            className={`overflow-hidden mb-6 transition-all duration-1000 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-background/50">
              Fitness tracking & coaching — demo build
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-[clamp(2.25rem,6vw,5.5rem)] font-extralight leading-[1.05] tracking-[-0.03em] text-background text-balance">
              Train smarter.
              <br className="hidden md:block" />
              Track everything
              <br className="hidden md:block" />
              that matters
            </h1>
          </div>
        </div>

        <div
          className={`mt-12 md:mt-16 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 transition-all duration-1000 delay-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="rounded-none bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/signup">Create account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-none border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <div className="hidden sm:flex items-center gap-6 sm:ml-4">
            <div className="w-12 h-px bg-background/30" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-background/40">
              Local demo · localStorage
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
