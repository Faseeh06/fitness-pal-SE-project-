"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Crosshair, Dumbbell, Loader2, MessageSquare, Send, Sparkles, Trash2, UtensilsCrossed } from "lucide-react"

import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  FITNESS_GOAL_LABEL,
  type FitnessGoalKey,
  getSuggestionPack,
  parseGoalFromProfile,
} from "@/lib/fitpal-ai-suggestions"
import { cn } from "@/lib/utils"

type SourceMode = "profile" | FitnessGoalKey

type ChatMsg = { role: "user" | "assistant"; content: string }

export default function AiPage() {
  const user = useDashboardUser()
  const [mode, setMode] = useState<SourceMode>("profile")
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [groqLoading, setGroqLoading] = useState(false)
  const [groqErr, setGroqErr] = useState<string | null>(null)
  const [groqModel, setGroqModel] = useState<string | null>(null)
  const [groqConfigured, setGroqConfigured] = useState<boolean | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  const profileGoal = useMemo(
    () => (user ? parseGoalFromProfile(user.goal) : "maintain"),
    [user],
  )

  const activeGoal: FitnessGoalKey = mode === "profile" ? profileGoal : mode
  const pack = useMemo(() => getSuggestionPack(activeGoal), [activeGoal])

  useEffect(() => {
    let cancelled = false
    fetch("/api/fitpal-ai")
      .then((r) => r.json())
      .then((d: { configured?: boolean; model?: string }) => {
        if (cancelled) return
        setGroqConfigured(Boolean(d.configured))
        if (d.model) setGroqModel(d.model)
      })
      .catch(() => {
        if (!cancelled) setGroqConfigured(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [chat])

  useEffect(() => {
    setGroqErr(null)
  }, [activeGoal])

  async function sendMessage() {
    if (!user) return
    const text = input.trim()
    if (!text || groqLoading || groqConfigured === false) return

    const userTurn: ChatMsg = { role: "user", content: text }
    const next = [...chat, userTurn]
    setChat(next)
    setInput("")
    setGroqLoading(true)
    setGroqErr(null)

    try {
      const res = await fetch("/api/fitpal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalKey: activeGoal,
          userName: user.name,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = (await res.json()) as { text?: string; model?: string; error?: string }
      if (!res.ok) {
        setGroqErr(data.error ?? "Request failed")
        setChat((c) => c.slice(0, -1))
        setInput(text)
        return
      }
      if (data.text) {
        setChat((c) => [...c, { role: "assistant", content: data.text }])
      }
      if (data.model) setGroqModel(data.model)
    } catch {
      setGroqErr("Network error — check your connection and dev server.")
      setChat((c) => c.slice(0, -1))
      setInput(text)
    } finally {
      setGroqLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  if (!user) return null

  return (
    <div>
      <DashboardPageHero
        kicker="Guidance"
        title="AI suggestions"
        description="Chat with the assistant (Groq · Llama 3.1 8B by default). Below: offline rules for your goal. Set GROQ_API_KEY in .env.local."
      />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
            Active goal
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-light tracking-tight">{FITNESS_GOAL_LABEL[activeGoal]}</span>
            {mode === "profile" ? (
              <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-wide">
                Profile
              </Badge>
            ) : (
              <Badge variant="secondary" className="rounded-none text-[10px] uppercase tracking-wide">
                Preview
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Saved: <span className="text-foreground/85">{FITNESS_GOAL_LABEL[profileGoal]}</span>
            {user.goal ? ` · ${user.goal}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("profile")}
            className={cn(
              "px-3 py-2 text-[11px] uppercase tracking-wide border transition-colors",
              mode === "profile"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            Use profile
          </button>
          {(Object.keys(FITNESS_GOAL_LABEL) as FitnessGoalKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              className={cn(
                "px-3 py-2 text-[11px] uppercase tracking-wide border transition-colors",
                mode === k
                  ? "border-foreground bg-secondary text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {FITNESS_GOAL_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-none border-border mb-10">
        <CardHeader className="border-b border-border/70 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">AI assistant</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {groqConfigured === null ? (
                <Badge variant="outline" className="rounded-none text-[10px]">
                  Checking…
                </Badge>
              ) : groqConfigured ? (
                <Badge variant="outline" className="rounded-none text-[10px] border-emerald-800/25 text-emerald-900 bg-emerald-50/60">
                  Groq ready
                </Badge>
              ) : (
                <Badge variant="destructive" className="rounded-none text-[10px]">
                  API key missing
                </Badge>
              )}
              {groqModel ? (
                <span className="text-[10px] text-muted-foreground font-mono">model: {groqModel}</span>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none h-8 text-muted-foreground gap-1"
                onClick={() => {
                  setChat([])
                  setGroqErr(null)
                }}
                disabled={chat.length === 0}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            {groqConfigured === false
              ? "Create .env.local from .env.example, add GROQ_API_KEY, restart the dev server."
              : "Ask for workouts, meals, recovery, or habits. Context uses the active goal above."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div
            ref={scrollRef}
            className="max-h-[min(420px,50vh)] overflow-y-auto border border-border bg-muted/20 px-3 py-3 space-y-3"
          >
            {chat.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-8 px-2">
                {groqConfigured === false
                  ? "Configure Groq to start chatting."
                  : "Try: “3 strength ideas for busy weekdays” or “High-protein snacks under 200 kcal.”"}
              </p>
            ) : (
              chat.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[92%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-background border border-border text-muted-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {groqLoading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-[13px] text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Thinking…
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={
                groqConfigured === false
                  ? "Set GROQ_API_KEY to chat…"
                  : "Message the assistant…"
              }
              disabled={groqLoading || groqConfigured === false}
              className="rounded-none flex-1"
              aria-label="Message"
            />
            <Button
              type="button"
              className="rounded-none gap-2 shrink-0 w-full sm:w-auto"
              onClick={() => void sendMessage()}
              disabled={groqLoading || !input.trim() || groqConfigured === false}
            >
              {groqLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>

          {groqErr ? (
            <p className="text-sm text-destructive leading-snug" role="alert">
              {groqErr}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="border border-border bg-secondary/35 px-5 py-5 md:px-7 md:py-6 mb-9 flex gap-4 items-start">
        <Sparkles className="h-4 w-4 shrink-0 text-foreground/35 mt-1" strokeWidth={1.5} aria-hidden />
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Offline summary</p>
          <h2 className="text-lg md:text-xl font-extralight tracking-tight text-balance max-w-2xl leading-snug">
            {pack.headline}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">
        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <Dumbbell className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Training</CardTitle>
            </div>
            <CardDescription className="text-xs">Emphasis for this goal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-2.5">
              {pack.workouts.map((line, i) => (
                <li key={`w-${i}`} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Meals</CardTitle>
            </div>
            <CardDescription className="text-xs">Patterns, not a fixed menu.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-2.5">
              {pack.meals.map((line, i) => (
                <li key={`m-${i}`} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border md:col-span-2 xl:col-span-1">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <Crosshair className="h-4 w-4 text-foreground/40" strokeWidth={1.5} aria-hidden />
              <CardTitle className="text-base font-light tracking-tight">Targets</CardTitle>
            </div>
            <CardDescription className="text-xs">Reminders — tune in Progress / Hydration.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="divide-y divide-border border border-border bg-background">
              {pack.targets.map((t) => (
                <li key={t.label} className="flex justify-between gap-4 px-3 py-2.5 text-[13px]">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="text-foreground text-right tabular-nums shrink-0">{t.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-9" />
      <p className="text-[11px] text-muted-foreground max-w-2xl leading-snug border-l-2 border-foreground/10 pl-4">
        {pack.notes}
      </p>
    </div>
  )
}
