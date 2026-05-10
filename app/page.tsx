import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { SassFeatures, PricingSection } from "@/components/saas-sections"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <main className="bg-background">
      <Navigation />
      <Hero />
      <SassFeatures />
      <PricingSection />
      
      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 lg:px-20 text-center border-t border-border/40 bg-secondary/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-normal mb-6">
            Get Started Today
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tight text-foreground mb-10 leading-tight uppercase">
            Stop guessing. Start <span className="font-black italic">growing.</span>
          </h2>
          <Button asChild size="lg" className="h-16 px-12 rounded-none bg-foreground text-background font-normal uppercase tracking-[0.3em] hover:opacity-90 shadow-2xl">
            <Link href="/signup">Join FitPal Alpha</Link>
          </Button>
          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-normal">
            No credit card required for trial · Local-first demo
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

