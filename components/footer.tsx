import Link from "next/link"

const footerLinks = [
  { label: "Features", href: "#projects" },
  { label: "Product", href: "#studio" },
  { label: "Experience", href: "#approach" },
  { label: "Articles", href: "#journal" },
  { label: "Get started", href: "#contact" },
]

const authLinks = [
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/signup" },
]

export function Footer() {
  return (
    <footer className="px-6 py-16 md:px-12 lg:px-20 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
        <div className="md:col-span-5">
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.3em] uppercase text-foreground"
          >
            FitPal
          </Link>
          <p className="text-sm leading-[1.75] text-muted-foreground mt-5 max-w-xs">
            Fitness tracking and coaching demo aligned with the FitPal requirements — signup and
            login use localStorage until a backend is added.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-5">
            Explore
          </p>
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-11">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-5">
            Account
          </p>
          <div className="flex flex-col gap-3">
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-border gap-4">
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground/50">
          FitPal demo — educational project.
        </p>
        <p className="text-[11px] tracking-[0.1em] text-muted-foreground/50">
          Frontend · localStorage
        </p>
      </div>
    </footer>
  )
}
