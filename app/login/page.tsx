"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_CREDENTIALS, ensureDemoUser, signIn } from "@/lib/fitpal-auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    ensureDemoUser()
    const params = new URLSearchParams(window.location.search)
    if (params.get("registered") === "1") {
      setNotice("Account created. Log in with your new credentials.")
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const result = signIn(email, password)
    setPending(false)
    if (result.ok) {
      router.push("/dashboard")
      router.refresh()
      return
    }
    setError(result.error)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle className="border border-border bg-background/80 backdrop-blur-sm" />
      </div>
      <Link
        href="/"
        className="mb-10 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        FitPal
      </Link>
      <Card className="w-full max-w-md border-border rounded-none shadow-none bg-card">
        <CardHeader className="space-y-1 pb-2">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
            Authentication
          </p>
          <CardTitle className="text-2xl font-light tracking-tight">Log in</CardTitle>
          <CardDescription className="text-muted-foreground">
            Demo mode — credentials are stored only in this browser (localStorage).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="text-sm border border-border bg-secondary/50 px-3 py-3 space-y-2">
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Demo login
              </p>
              <p className="text-foreground tabular-nums">
                <span className="text-muted-foreground">Email </span>
                {DEMO_CREDENTIALS.email}
              </p>
              <p className="text-foreground tabular-nums">
                <span className="text-muted-foreground">Password </span>
                {DEMO_CREDENTIALS.password}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-none w-full mt-1"
                onClick={() => {
                  setEmail(DEMO_CREDENTIALS.email)
                  setPassword(DEMO_CREDENTIALS.password)
                }}
              >
                Fill demo credentials
              </Button>
            </div>
            {notice ? (
              <p className="text-sm text-foreground bg-secondary border border-border px-3 py-2">
                {notice}
              </p>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="text-sm text-destructive bg-destructive/10 border border-border px-3 py-2"
              >
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full rounded-none" disabled={pending}>
              {pending ? "Signing in…" : "Continue to dashboard"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {"No account? "}
              <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
