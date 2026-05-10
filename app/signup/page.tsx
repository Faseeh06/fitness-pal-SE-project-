"use client"

import { useState } from "react"
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
import { signUp } from "@/lib/fitpal-auth"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setPending(true)
    const result = signUp({ name, email, password })
    setPending(false)
    if (result.ok) {
      router.push("/login?registered=1")
      router.refresh()
      return
    }
    setError(result.error)
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Sexy background blobs */}
      <div className="absolute inset-0 bg-[#f9f9f7] dark:bg-black -z-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200/40 dark:bg-emerald-900/10 blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-sky-200/30 dark:bg-sky-900/10 blur-[100px] -z-10 animate-bounce duration-[15000ms]" />

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
            New Registration
          </p>
          <CardTitle className="text-2xl font-extralight tracking-tight uppercase">Create Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
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
                <Label htmlFor="name" className="text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground ml-1">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="FULL NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-none bg-transparent border-border/60 placeholder:text-muted-foreground/30 focus:ring-0"
                  required
                />
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-none bg-transparent border-border/60 focus:ring-0"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="rounded-none bg-transparent border-border/60 focus:ring-0"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-6 pb-8">
            <Button type="submit" className="w-full rounded-none h-11 font-normal uppercase tracking-[0.3em] transition-all bg-foreground text-background hover:bg-foreground/90" disabled={pending}>
              {pending ? "Creating…" : "Register"}
            </Button>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {"Already a member? "}
              <Link href="/login" className="text-primary hover:underline underline-offset-4">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
