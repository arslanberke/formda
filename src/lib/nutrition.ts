import type { Activity, Goal, Profile } from './types'

const ACT: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }

export function age(p: Profile) { return new Date().getFullYear() - p.birthYear }

export function bmr(p: Profile, weightKg: number) {
  const a = age(p)
  const base = 10 * weightKg + 6.25 * p.heightCm - 5 * a
  return p.sex === 'm' ? base + 5 : base - 161
}

export function tdee(p: Profile, weightKg: number) { return bmr(p, weightKg) * ACT[p.activity] }

export interface Targets { kcal: number; protein: number; carbs: number; fat: number; waterMl: number }

export function targets(p: Profile, weightKg: number): Targets {
  const t = tdee(p, weightKg)
  const adj: Record<Goal, number> = { lose: -500, maintain: 0, gain: 300 }
  const floor = p.sex === 'm' ? 1500 : 1200
  const kcal = Math.round(Math.max(floor, t + adj[p.goal]) / 10) * 10
  const proteinPerKg = p.goal === 'lose' ? 2.0 : p.goal === 'gain' ? 1.8 : 1.6
  const protein = Math.round(weightKg * proteinPerKg)
  const fat = Math.round((kcal * 0.27) / 9)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  const waterMl = Math.round((weightKg * 35) / 250) * 250
  return { kcal, protein, carbs, fat, waterMl }
}

export function bmi(heightCm: number, weightKg: number) {
  const h = heightCm / 100
  return weightKg / (h * h)
}

export function bmiLabel(b: number) {
  if (b < 18.5) return 'Zayıf'
  if (b < 25) return 'Normal'
  if (b < 30) return 'Fazla kilolu'
  return 'Obez'
}
