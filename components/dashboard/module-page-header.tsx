export function ModulePageHeader({
  title,
  description,
  kicker = "Module",
}: {
  title: string
  description?: string
  kicker?: string
}) {
  return (
    <header className="mb-10 md:mb-12 pb-8 border-b border-border">
      <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-2">{kicker}</p>
      <h1 className="text-3xl md:text-[2.35rem] font-extralight tracking-tight text-balance">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed mt-4">{description}</p>
      ) : null}
    </header>
  )
}
