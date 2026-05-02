"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "#projects" },
  { label: "Product", href: "#studio" },
  { label: "Experience", href: "#approach" },
  { label: "Articles", href: "#journal" },
  { label: "Get started", href: "#contact" },
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

  const lightOnHero = isHome && !scrolled && !isOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden && !isOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        lightOnHero ? "bg-transparent" : "bg-background/95 backdrop-blur-md border-b border-border"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <Link
          href="/"
          className={`text-xs font-medium tracking-[0.3em] uppercase transition-colors duration-500 ${
            lightOnHero ? "text-background" : "text-foreground"
          }`}
        >
          FitPal
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 hover:opacity-100 ${
                lightOnHero
                  ? "text-background/60 hover:text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className={`text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 ${
              lightOnHero
                ? "text-background/80 hover:text-background"
                : "text-foreground hover:text-muted-foreground"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`text-[11px] tracking-[0.15em] uppercase border px-4 py-2 transition-colors duration-500 ${
              lightOnHero
                ? "border-background/40 text-background hover:bg-background hover:text-foreground"
                : "border-border text-foreground hover:bg-secondary"
            }`}
          >
            Sign up
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition-colors duration-500 ${
            lightOnHero && !isOpen ? "text-background" : "text-foreground"
          }`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        } bg-background border-t border-border`}
      >
        <div className="flex flex-col px-6 py-10 gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-light tracking-tight text-foreground hover:text-muted-foreground transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="text-lg font-light tracking-tight text-foreground pt-4 border-t border-border"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="text-lg font-light tracking-tight text-foreground"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
