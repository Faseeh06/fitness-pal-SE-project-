"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Coaching", href: "#ai" },
  { label: "Analytics", href: "#analytics" },
  { label: "Pricing", href: "#pricing" },
]

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 60)
      setHidden(currentY > lastScrollY && currentY > 400)
      setLastScrollY(currentY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navThemeClass = scrolled || !isHome || isOpen
    ? "bg-background/80 backdrop-blur-xl border-b border-border/40 py-4"
    : "bg-transparent py-6"

  const textThemeClass = "text-foreground"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden && !isOpen ? "-translate-y-full" : "translate-y-0"
      } ${navThemeClass}`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8">
            <Image
              src="/logo.png"
              alt="FitPal"
              fill
              className="object-contain invert dark:invert-0"
            />
          </div>
          <span className={`text-[13px] font-black tracking-[0.3em] uppercase transition-colors duration-500 ${textThemeClass}`}>
            FitPal
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[11px] font-normal tracking-[0.15em] uppercase transition-all duration-500 hover:opacity-100 text-muted-foreground hover:text-foreground`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border/40 mx-2" />
          <Link
            href="/login"
            className={`text-[11px] font-normal tracking-[0.15em] uppercase transition-colors duration-500 text-foreground hover:text-primary`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`text-[10px] font-normal tracking-[0.2em] uppercase px-5 py-2 transition-all duration-500 rounded-none border border-border bg-foreground text-background hover:opacity-90`}
          >
            Sign up
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition-colors duration-500 ${textThemeClass}`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-background`}
      >
        <div className="flex flex-col px-8 py-12 gap-8 h-screen">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-3xl font-black tracking-tight text-foreground/90 uppercase"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-auto pb-24">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold tracking-widest text-foreground uppercase pt-8 border-t border-border/40"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-primary-foreground text-center py-4 text-xl font-black tracking-widest uppercase"
            >
              Start Training
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

