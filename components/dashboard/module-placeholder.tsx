import Link from "next/link"

import { Button } from "@/components/ui/button"

export function ModulePlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
        Module
      </p>
      <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-balance mb-4">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-10">{description}</p>
      <Button asChild variant="outline" className="rounded-none">
        <Link href="/dashboard">Back to overview</Link>
      </Button>
    </div>
  )
}
