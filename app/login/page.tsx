"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Sexy background blobs */}
      <div className="absolute inset-0 bg-[#f9f9f7] dark:bg-black -z-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-200/40 dark:bg-amber-900/20 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-orange-200/30 dark:bg-orange-900/10 blur-[100px] -z-10 animate-bounce duration-[10000ms]" />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle className="border border-border/40 bg-background/40 backdrop-blur-md rounded-full shadow-lg" />
      </div>

      <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="relative h-14 w-14 mb-4">
          <Image src="/logo.png" alt="FitPal Logo" fill className="object-contain invert dark:invert-0" />
        </div>
        <p className="text-[12px] font-black tracking-[0.4em] uppercase text-foreground leading-none">
          FitPal
        </p>
      </div>

      <Card className="w-full max-w-md border-border/60 rounded-none shadow-none bg-white/40 dark:bg-black/40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700">
        <CardHeader className="space-y-2 pb-6 text-center border-b border-border/40">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-normal">
            Secure Authentication
          </p>
          <CardTitle className="text-2xl font-extralight tracking-tight uppercase">Member Login</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="group relative overflow-hidden rounded-none border border-border/60 bg-secondary/20 p-4 transition-all hover:bg-secondary/40">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-normal">
                  Demo Credentials
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase mb-0.5 tracking-wider">Email</p>
                  <p className="text-xs font-medium tabular-nums">{DEMO_CREDENTIALS.email}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase mb-0.5 tracking-wider">Password</p>
                  <p className="text-xs font-medium tabular-nums">{DEMO_CREDENTIALS.password}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-none font-normal text-[10px] uppercase tracking-widest border-border/60"
                onClick={() => {
                  setEmail(DEMO_CREDENTIALS.email)
                  setPassword(DEMO_CREDENTIALS.password)
                }}
              >
                Autofill
              </Button>
            </div>

            {notice ? (
              <div className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-none px-4 py-3 font-normal animate-in fade-in duration-300">
                {notice}
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="text-[11px] uppercase tracking-wider text-destructive bg-destructive/10 border border-destructive/20 rounded-none px-4 py-3 font-normal animate-in shake duration-300"
              >
                {error}
              </div>
            ) : null}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="NAME@EXAMPLE.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none bg-transparent border-border/60 placeholder:text-muted-foreground/30 focus:ring-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground">Password</Label>
                  <Link href="#" className="text-[9px] font-normal uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none bg-transparent border-border/60 focus:ring-0"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-4 pb-8">
            <Button type="submit" className="w-full rounded-none h-11 font-normal uppercase tracking-[0.3em] transition-all bg-foreground text-background hover:bg-foreground/90" disabled={pending}>
              {pending ? "Processing…" : "Login"}
            </Button>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {"New member? "}
              <Link href="/signup" className="text-primary hover:underline underline-offset-4">
                Join now
              </Link>
            </p>
          </CardFooter>

        </form>
      </Card>
    </div>
  )
}

