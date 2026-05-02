"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"

import { AsideNote } from "@/components/dashboard/aside-note"
import { useDashboardUser } from "@/components/dashboard/dashboard-context"
import { ModulePageHeader } from "@/components/dashboard/module-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FITNESS_GOAL_LABEL, type FitnessGoalKey } from "@/lib/fitpal-ai-suggestions"
import { updateUserProfile } from "@/lib/fitpal-auth"

const GOAL_KEYS: FitnessGoalKey[] = ["weight_loss", "muscle_gain", "maintain"]

function sessionGoalToKey(g: string | undefined): FitnessGoalKey {
  const v = (g ?? "").toLowerCase().trim()
  if (v === "muscle_gain" || v === "muscle gain") return "muscle_gain"
  if (v === "weight_loss" || v === "weight loss") return "weight_loss"
  if (v === "maintain" || v === "maintain / general") return "maintain"
  return "maintain"
}

export default function ProfilePage() {
  const user = useDashboardUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [goal, setGoal] = useState<FitnessGoalKey>("maintain")
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setAge(user.age != null ? String(user.age) : "")
    setWeight(user.weight != null ? String(user.weight) : "")
    setHeight(user.height != null ? String(user.height) : "")
    setGoal(sessionGoalToKey(user.goal))
    setError(null)
  }, [user])

  if (!user) return null

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    const ageTrim = age.trim()
    const wTrim = weight.trim()
    const hTrim = height.trim()

    const ageNum =
      ageTrim === "" ? null : Number.parseInt(ageTrim, 10)
    if (ageTrim !== "" && !Number.isFinite(ageNum)) {
      setError("Age must be a whole number.")
      return
    }

    const weightNum =
      wTrim === "" ? null : Number.parseFloat(wTrim)
    if (wTrim !== "" && !Number.isFinite(weightNum)) {
      setError("Weight must be a number (kg).")
      return
    }

    const heightNum =
      hTrim === "" ? null : Number.parseFloat(hTrim)
    if (hTrim !== "" && !Number.isFinite(heightNum)) {
      setError("Height must be a number (cm).")
      return
    }

    const result = updateUserProfile(user.id, {
      name: name.trim(),
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      goal,
    })

    if (!result.ok) {
      setError(result.error)
      return
    }
    setSaved(true)
  }

  return (
    <div>
      <ModulePageHeader
        icon={User}
        kicker="Account"
        title="Profile"
        description="Name and goal update your session everywhere. Demo data stays in localStorage."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Card className="rounded-none border-border">
          <CardHeader className="border-b border-border/80">
            <CardTitle className="text-base font-light tracking-tight">Your details</CardTitle>
            <CardDescription>Email is read-only in this demo; other fields sync to your session.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="pf-name">Name</Label>
                <Input
                  id="pf-name"
                  value={name}
                  onChange={(e) => {
                    setSaved(false)
                    setName(e.target.value)
                  }}
                  autoComplete="name"
                  className="rounded-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pf-email">Email</Label>
                <Input
                  id="pf-email"
                  value={email}
                  readOnly
                  className="rounded-none bg-muted/40 text-muted-foreground"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pf-age">Age (optional)</Label>
                  <Input
                    id="pf-age"
                    value={age}
                    onChange={(e) => {
                      setSaved(false)
                      setAge(e.target.value)
                    }}
                    inputMode="numeric"
                    placeholder="—"
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-weight">Weight kg (optional)</Label>
                  <Input
                    id="pf-weight"
                    value={weight}
                    onChange={(e) => {
                      setSaved(false)
                      setWeight(e.target.value)
                    }}
                    inputMode="decimal"
                    placeholder="—"
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-height">Height cm (optional)</Label>
                  <Input
                    id="pf-height"
                    value={height}
                    onChange={(e) => {
                      setSaved(false)
                      setHeight(e.target.value)
                    }}
                    inputMode="decimal"
                    placeholder="—"
                    className="rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary goal</Label>
                <Select
                  value={goal}
                  onValueChange={(v) => {
                    setSaved(false)
                    setGoal(v as FitnessGoalKey)
                  }}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {GOAL_KEYS.map((k) => (
                      <SelectItem key={k} value={k} className="rounded-none">
                        {FITNESS_GOAL_LABEL[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Shapes the rule-based tips on AI suggestions.
                </p>
              </div>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              {saved ? (
                <p className="text-sm text-foreground/80">Profile saved.</p>
              ) : null}

              <Button type="submit" className="rounded-none">
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <AsideNote>
          <p>Sidebar and modules read this profile after you save.</p>
          <p>Passwords aren’t shown — demo only, plain text in storage.</p>
        </AsideNote>
      </div>
    </div>
  )
}
