/** Demo-only auth helpers — passwords stored in plain text in localStorage. Do not use in production. */

/** Pre-filled account for quick testing — merged into localStorage on first use. */
export const DEMO_CREDENTIALS = {
  email: "demo@fitpal.local",
  password: "demo123",
  name: "Demo Athlete",
  /** Stable id so workout history and activity keys stay consistent. */
  id: "fitpal-demo-user",
} as const

export type FitPalUser = {
  id: string
  name: string
  email: string
  password: string
  age?: number
  weight?: number
  height?: number
  goal?: string
}

export type FitPalSessionUser = Omit<FitPalUser, 'password'>

const USERS_KEY = 'fitpal_users'
const SESSION_KEY = 'fitpal_session'

function readUsers(): Record<string, FitPalUser> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, FitPalUser>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeUsers(users: Record<string, FitPalUser>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

/** Ensures the demo user row exists (does not overwrite if email already registered). */
export function ensureDemoUser() {
  if (typeof window === "undefined") return
  const users = readUsers()
  const email = normalizeEmail(DEMO_CREDENTIALS.email)
  if (users[email]) return
  users[email] = {
    id: DEMO_CREDENTIALS.id,
    name: DEMO_CREDENTIALS.name,
    email,
    password: DEMO_CREDENTIALS.password,
  }
  writeUsers(users)
}

export function signUp(input: {
  name: string
  email: string
  password: string
}): { ok: true } | { ok: false; error: string } {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Unavailable on server.' }
  }
  ensureDemoUser()
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const password = input.password
  if (!name || !email || !password) {
    return { ok: false, error: 'Please fill in name, email, and password.' }
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }
  const users = readUsers()
  if (users[email]) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  users[email] = {
    id,
    name,
    email,
    password,
  }
  writeUsers(users)
  return { ok: true }
}

export function signIn(
  emailRaw: string,
  password: string,
): { ok: true; user: FitPalSessionUser } | { ok: false; error: string } {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Unavailable on server.' }
  }
  const email = normalizeEmail(emailRaw)
  if (!email || !password) {
    return { ok: false, error: 'Enter email and password.' }
  }
  ensureDemoUser()
  const users = readUsers()
  const user = users[email]
  if (!user || user.password !== password) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  const sessionUser: FitPalSessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    weight: user.weight,
    height: user.height,
    goal: user.goal,
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
  return { ok: true, user: sessionUser }
}

export function signOut() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export function getSession(): FitPalSessionUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const user = JSON.parse(raw) as FitPalSessionUser
    if (!user?.email || !user?.id) return null
    return user
  } catch {
    return null
  }
}
