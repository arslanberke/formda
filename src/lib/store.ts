import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSyncExternalStore } from 'react'
import type { AppState } from './types'
import { excludeFromProgram } from './program'

const KEY = 'formda:v1'

export const emptyState: AppState = {
  version: 1,
  profile: null,
  assessment: null,
  program: null,
  workouts: [],
  progress: {},
  foods: [],
  water: {},
  body: [],
  customFoods: [],
  activeWorkout: null,
  cardio: [],
}

let state: AppState = emptyState
let hydrated = false
const listeners = new Set<() => void>()

export async function hydrate() {
  if (hydrated) return
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if (raw) state = { ...emptyState, ...JSON.parse(raw) }
    // eski programlarda ilk hareket 45 sn jumping jack ısınmasıydı; artık ayrı ısınma akışı var
    state.program?.days.forEach((d) => { if (d.items[0]?.exerciseId === 'jumping_jack' && d.items[0].reps === 45 && d.items[0].sets === 1) { d.items.shift(); persist() } })
  } catch {
    state = emptyState
  }
  hydrated = true
  listeners.forEach((l) => l())
}

export function isHydrated() { return hydrated }

let saveTimer: ReturnType<typeof setTimeout> | null = null
function persist() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {})
  }, 150)
}

function emit() {
  persist()
  listeners.forEach((l) => l())
}

export function getState() { return state }

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const p = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...p }
  emit()
}

export function replaceState(next: Partial<AppState>) {
  state = { ...emptyState, ...next, version: 1 }
  emit()
}

export async function resetState() {
  state = emptyState
  await AsyncStorage.removeItem(KEY)
  listeners.forEach((l) => l())
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb) } },
    () => selector(state),
    () => selector(state),
  )
}

export function useHydrated() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb) } },
    () => hydrated,
    () => hydrated,
  )
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export function todayStr(d = new Date()) {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return todayStr(d)
}

export function exportJson(): string { return JSON.stringify(state) }

export function excludeExercise(id: string) {
  setState((s) => {
    if (!s.profile) return {}
    const { profile, program } = excludeFromProgram(s.profile, s.assessment, s.program, id, s.body[s.body.length - 1]?.weightKg ?? 75)
    return { profile, program }
  })
}

export function includeExercise(id: string) {
  setState((s) => (s.profile ? { profile: { ...s.profile, excluded: (s.profile.excluded ?? []).filter((x) => x !== id) } } : {}))
}
