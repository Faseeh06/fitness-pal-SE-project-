/**
 * Horizontal padding for dashboard main — keep in sync with `dashboardBleedX`.
 * Full-bleed sections use negative horizontal margin equal to this padding.
 */
export const dashboardMainClassName =
  "flex-1 w-full min-w-0 px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-9 xl:px-12 xl:py-10 2xl:px-16 bg-gradient-to-b from-muted/40 via-background to-background dark:from-zinc-950 dark:via-background dark:to-background"

export const dashboardBleedX =
  "-mx-5 md:-mx-8 lg:-mx-10 xl:-mx-12 2xl:-mx-16"

/** Horizontal inset for page heroes — keeps the band slightly inside the padded main column. */
export const dashboardHeroInset =
  "mx-2.5 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 2xl:mx-12"
