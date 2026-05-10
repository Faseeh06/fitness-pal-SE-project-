"use client"

import { Check, Sparkles, Zap, Shield, BarChart3, Clock } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    title: "AI Coaching",
    description: "Personalized workout and meal suggestions powered by rule-based intelligence.",
    icon: Sparkles,
    color: "text-amber-500",
  },
  {
    title: "Precision Analytics",
    description: "Track every calorie, step, and session with industrial-grade charts.",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    title: "Zero-Latency Sync",
    description: "Your data stays in sync with local-first architecture for ultimate speed.",
    icon: Zap,
    color: "text-orange-500",
  },
  {
    title: "Privacy First",
    description: "End-to-end encryption. Your fitness data belongs only to you.",
    icon: Shield,
    color: "text-sky-500",
  },
  {
    title: "Daily Scheduler",
    description: "Manage your training blocks and recovery periods in one unified view.",
    icon: Clock,
    color: "text-indigo-500",
  },
  {
    title: "Bio-Metrics",
    description: "Monitor hydration, weight trends, and energy output seamlessly.",
    icon: BarChart3,
    color: "text-emerald-500",
  },
]

export function SassFeatures() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section id="features" className="py-32 px-6 md:px-12 lg:px-20 bg-background overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`max-w-3xl mb-24 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-normal mb-4">
            Platform Capabilities
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tight text-foreground leading-[1.1] uppercase">
            Engineered for <span className="font-black italic">Performance.</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground font-light leading-relaxed">
            Stop guessing. FitPal provides the infrastructure you need to reach your peak potential
            with scientific precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 border border-border/40">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group bg-background p-10 hover:bg-secondary/40 transition-all duration-500"
            >
              <feature.icon className={`h-8 w-8 ${feature.color} mb-8 transition-transform group-hover:scale-110`} strokeWidth={1.2} />
              <h3 className="text-[14px] font-normal uppercase tracking-[0.2em] text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  const { ref, isVisible } = useScrollReveal(0.1)

  return (
    <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 bg-secondary/10 text-foreground overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`text-center mb-24 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-normal mb-4">
            Transparent Scaling
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tight leading-[1.1] uppercase">
            Ready to <span className="font-black italic text-primary">Optimize?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="flex flex-col p-10 border border-border bg-background/50 hover:bg-background transition-all rounded-none">
            <p className="text-[10px] font-normal tracking-[0.3em] uppercase text-muted-foreground mb-2">Basic</p>
            <h3 className="text-4xl font-extralight tracking-tighter mb-8">$0<span className="text-sm font-light text-muted-foreground ml-1">/mo</span></h3>
            <ul className="space-y-4 mb-10 flex-1">
              {["Daily Logs", "Basic Analytics", "Single Goal", "Local Storage"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs text-muted-foreground font-light uppercase tracking-wide">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="rounded-none border-border hover:bg-secondary/80 uppercase tracking-[0.2em] font-normal text-[10px] h-12">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="relative flex flex-col p-10 border border-primary bg-background scale-105 z-10 shadow-2xl shadow-primary/5 rounded-none">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[9px] font-normal uppercase tracking-[0.3em]">Elite Tier</div>
            <p className="text-[10px] font-normal tracking-[0.3em] uppercase text-primary mb-2">Pro Access</p>
            <h3 className="text-4xl font-extralight tracking-tighter mb-8 text-primary">$12<span className="text-sm font-light text-muted-foreground ml-1">/mo</span></h3>
            <ul className="space-y-4 mb-10 flex-1">
              {["Everything in Basic", "Advanced AI Coach", "Unlimited Goals", "Metric Export", "Priority Sync"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs text-foreground font-normal uppercase tracking-wide">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
            <Button asChild className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-normal text-[10px] h-12">
              <Link href="/signup">Go Pro Now</Link>
            </Button>
          </div>

          {/* Team Tier */}
          <div className="flex flex-col p-10 border border-border bg-background/50 hover:bg-background transition-all rounded-none">
            <p className="text-[10px] font-normal tracking-[0.3em] uppercase text-muted-foreground mb-2">Squad</p>
            <h3 className="text-4xl font-extralight tracking-tighter mb-8">$49<span className="text-sm font-light text-muted-foreground ml-1">/mo</span></h3>
            <ul className="space-y-4 mb-10 flex-1">
              {["Up to 10 Athletes", "Group Insights", "shared Schedules", "Team Support"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs text-muted-foreground font-light uppercase tracking-wide">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="rounded-none border-border hover:bg-secondary/80 uppercase tracking-[0.2em] font-normal text-[10px] h-12">
              <Link href="/signup">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

