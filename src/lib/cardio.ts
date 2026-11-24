import type { CardioKind, CardioLog } from './types'

export const CARDIO_KINDS: { value: CardioKind; label: string; icon: string }[] = [
  { value: 'treadmill_run', label: 'Bantta koşu', icon: '🏃' },
  { value: 'treadmill_walk', label: 'Bantta yürüyüş', icon: '🚶' },
  { value: 'outdoor_run', label: 'Dışarıda koşu', icon: '🌳' },
  { value: 'walk', label: 'Yürüyüş', icon: '👟' },
  { value: 'bike', label: 'Bisiklet / eliptik', icon: '🚴' },
  { value: 'other', label: 'Diğer', icon: '⚡' },
]

const MET: Record<CardioKind, number> = { treadmill_run: 9.8, outdoor_run: 9.8, treadmill_walk: 3.8, walk: 3.5, bike: 6.8, other: 5 }

const isRun = (k: CardioKind) => k === 'treadmill_run' || k === 'outdoor_run'
const isWalk = (k: CardioKind) => k === 'treadmill_walk' || k === 'walk'

// Saat kalori vermezse tahmin: koşuda ~1 kcal/kg/km, yürüyüşte ~0.5 (+eğim), yoksa MET × kg × saat
export function estimateKcal(c: Omit<CardioLog, 'id' | 'date'>, weightKg: number): number {
  if (c.km && isRun(c.kind)) return Math.round(weightKg * c.km * 1.0)
  if (c.km && isWalk(c.kind)) return Math.round(weightKg * c.km * (0.5 + (c.inclinePct ?? 0) * 0.04))
  const met = MET[c.kind] + (isWalk(c.kind) ? (c.inclinePct ?? 0) * 0.4 : 0)
  return Math.round(met * weightKg * (c.minutes / 60))
}

export function pace(c: CardioLog): string | null {
  if (!c.km || !c.minutes) return null
  const p = c.minutes / c.km
  return `${Math.floor(p)}:${String(Math.round((p % 1) * 60)).padStart(2, '0')} /km`
}

export function speed(c: CardioLog): number | null {
  return c.km && c.minutes ? Math.round((c.km / (c.minutes / 60)) * 10) / 10 : null
}
