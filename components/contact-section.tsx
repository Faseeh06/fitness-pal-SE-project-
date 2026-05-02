"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function ContactSection() {
  const { ref: headRef, isVisible: headVisible } = useScrollReveal(0.15)
  const { ref: bodyRef, isVisible: bodyVisible } = useScrollReveal(0.1)

  return (
    <section id="contact" className="px-6 py-28 md:px-12 lg:px-20 md:py-36 bg-foreground text-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
        <div
          ref={headRef}
          className={`transition-all duration-1000 ${
            headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-background/40 mb-8">
            Next step
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extralight leading-[1.15] tracking-tight text-balance">
            Sign up, log in, then we&apos;ll flesh out the dashboard
          </h2>
          <div className="mt-10 flex flex-col gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 text-sm tracking-wide text-background/90 hover:text-background transition-colors duration-500 w-fit"
            >
              <span className="border-b border-background/25 pb-0.5 group-hover:border-background/70 transition-colors duration-500">
                Create a demo account
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 text-sm tracking-wide text-background/55 hover:text-background transition-colors duration-500 w-fit"
            >
              <span className="border-b border-background/15 pb-0.5 group-hover:border-background/50 transition-colors duration-500">
                Already registered — log in
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        <div
          ref={bodyRef}
          className={`flex flex-col justify-end transition-all duration-1000 delay-200 ${
            bodyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-background/35 mb-5">
                Navigation flow
              </p>
              <p className="text-sm leading-[1.75] text-background/55">
                Login → Dashboard
                <br />
                Signup → Login → Dashboard
              </p>
              <p className="text-sm text-background/45 mt-6">
                Matches the requirements doc; storage is browser-only for now.
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-background/35 mb-5">
                Coming modules
              </p>
              <p className="text-sm leading-[1.75] text-background/55">
                Workouts · Nutrition · Hydration · Progress · Schedule · Profile · AI suggestions
              </p>
              <p className="text-sm text-background/45 mt-6">
                Dashboard page exists as a stub after authentication succeeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
