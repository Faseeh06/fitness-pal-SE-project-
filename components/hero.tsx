"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 dark:bg-amber-900/10 blur-[120px] -z-10" />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 text-center max-w-6xl mx-auto">
        <div
          className={`mb-8 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-none border border-primary/30 bg-primary/5 text-primary text-[10px] font-normal tracking-[0.4em] uppercase">
            Precision Platform Alpha
          </span>
        </div>

        <h1
          className={`text-[clamp(2.5rem,8vw,7rem)] font-extralight leading-[1] tracking-[-0.04em] text-foreground text-balance transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Precision <span className="font-black italic text-primary">Intelligence</span>
          <br />
          For Your Fitness.
        </h1>

        <p
          className={`mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          The all-in-one athletic management system designed for elite performance.
          Track sessions, analyze metrics, and grow with AI-driven coaching.
        </p>

        <div
          className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="h-14 px-10 rounded-none bg-foreground text-background font-normal uppercase tracking-[0.3em] hover:opacity-90 shadow-2xl"
          >
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 px-10 rounded-none border-border bg-transparent text-foreground font-normal uppercase tracking-[0.3em] hover:bg-secondary/50"
          >
            <Link href="/login">Live Demo</Link>
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div
          className={`mt-24 relative w-full aspect-[16/10] max-w-5xl mx-auto border border-border bg-card rounded-none overflow-hidden shadow-2xl transition-all duration-1000 delay-1000 ${
            visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-10 bg-secondary/50 flex items-center px-4 gap-2 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            <div className="flex-1 text-[9px] text-muted-foreground/40 tracking-[0.3em] uppercase font-normal text-center">app.fitpal.io/dashboard</div>
          </div>
          <div className="absolute inset-0 top-10 flex items-center justify-center bg-background/60 backdrop-blur-sm group cursor-pointer">
            <div className="text-center group-hover:scale-105 transition-transform duration-500">
              <div className="h-16 w-16 rounded-none bg-primary flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary-foreground border-b-[8px] border-b-transparent ml-1" />
              </div>
              <p className="text-[10px] font-normal tracking-[0.3em] uppercase text-foreground">Watch Platform Tour</p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&q=80"
            alt="Dashboard Preview"
            className="w-full h-full object-cover opacity-50 grayscale"
          />
        </div>
      </div>
    </section>
  )
}


