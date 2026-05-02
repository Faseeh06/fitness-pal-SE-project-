"use client"

import { createContext, useContext } from "react"

import type { FitPalSessionUser } from "@/lib/fitpal-auth"

const DashboardUserContext = createContext<FitPalSessionUser | null>(null)

export function DashboardUserProvider({
  user,
  children,
}: {
  user: FitPalSessionUser
  children: React.ReactNode
}) {
  return (
    <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>
  )
}

export function useDashboardUser() {
  const ctx = useContext(DashboardUserContext)
  return ctx
}
