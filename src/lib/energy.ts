import { estimateKcal } from './cardio'
import { bmr, targets, tdee } from './nutrition'
import { addDays, todayStr, useStore } from './store'
import type { AppState, CardioLog, Profile } from './types'

// Kaynaklar ve gerekçe: docs/kalori-hesabi.md
const TEF = 0.1                 // sindirim: yenenin ~%10'u, BMR'ye oranla yaklaşık
const WALK_NET = 0.57           // kcal/kg/km, net yürüme maliyeti (Sci Rep 2019 meta-analiz, 2.4 J/kg/m)
const STRENGTH_MET = 3.5        // ağırlık antrenmanı, orta (Compendium of Physical Activities)
const KCAL_PER_KG = 7700
const WINDOW = 28
const MIN_DAYS = 14             // en az bu kadar gün yemek kaydı
const MIN_SPAN = 14             // ilk ve son tartı arası en az bu kadar gün
const LOGGED_MIN_KCAL = 800     // bundan az girilen gün "eksik kayıt" sayılır

const isWalkRun = (k: CardioLog['kind']) => k !== 'bike' && k !== 'other'

export function stepKcal(steps: number, p: Profile, weightKg: number) {
  const strideKm = (p.heightCm * 0.415) / 100000
  return steps * strideKm * weightKg * WALK_NET
}

// Keytel 2005: brüt kcal/dk (dinlenme dahil), VO2max'sız denklem
export function keytelKcalPerMin(hr: number, p: Profile, weightKg: number, age: number) {
  const kj = p.sex === 'm'
    ? -55.0969 + 0.6309 * hr + 0.1988 * weightKg + 0.2017 * age
    : -20.4022 + 0.4472 * hr - 0.1263 * weightKg + 0.074 * age
  return Math.max(0, kj / 4.184)
}

// Kardiyonun net (dinlenme üstü) kalorisi. Saatten girilen "aktif kalori" zaten net.
export function cardioNetKcal(c: CardioLog, p: Profile, weightKg: number, age: number) {
  if (c.kcal != null) return c.kcal
  const restPerMin = bmr(p, weightKg) / 1440
  if (c.avgHr && c.avgHr >= 90) return Math.max(0, (keytelKcalPerMin(c.avgHr, p, weightKg, age) - restPerMin) * c.minutes)
  return Math.max(0, estimateKcal(c, weightKg) - restPerMin * c.minutes)
}

export interface DayBurn {
  rest: number      // BMR
  digest: number    // sindirim
  steps: number     // adımdan (antrenman dışı)
  training: number  // ağırlık + kardiyo
  watch?: number    // saatin aktif kalorisi (adım + antrenman yerine)
  total: number
  measured: boolean // adım/saat verisi var mı; yoksa aktivite seviyesinden tahmin
}

export function dayBurn(s: AppState, date: string, weightKg: number): DayBurn | null {
  const p = s.profile
  if (!p) return null
  const age = new Date().getFullYear() - p.birthYear
  const rest = bmr(p, weightKg)
  const digest = rest * TEF
  const act = s.activity?.[date]
  const cardio = s.cardio.filter((c) => c.date === date)
  const lifts = s.workouts.filter((w) => w.date === date && w.finishedAt)
  const liftMin = lifts.reduce((a, w) => a + Math.min(120, (Date.parse(w.finishedAt!) - Date.parse(w.startedAt)) / 60000), 0)
  const training = Math.round(cardio.reduce((a, c) => a + cardioNetKcal(c, p, weightKg, age), 0) + (STRENGTH_MET - 1) * weightKg * (liftMin / 60))
  if (act?.activeKcal != null) {
    return { rest, digest, steps: 0, training: 0, watch: act.activeKcal, total: Math.round(rest + digest + act.activeKcal), measured: true }
  }
  if (act?.steps != null) {
    // koşu/yürüyüşün adımları zaten günlük adımın içinde: o km'lerin yürüme maliyetini düş
    const cardioKm = cardio.filter((c) => isWalkRun(c.kind)).reduce((a, c) => a + (c.km ?? 0), 0)
    const steps = Math.max(0, stepKcal(act.steps, p, weightKg) - cardioKm * weightKg * WALK_NET)
    return { rest, digest, steps: Math.round(steps), training, total: Math.round(rest + digest + steps + training), measured: true }
  }
  // veri yoksa: aktivite seviyesi çarpanı (günlük hareketi zaten içerir) + bugünkü antrenman
  const base = tdee(p, weightKg)
  return { rest, digest, steps: Math.round(base - rest - digest), training, total: Math.round(base + training), measured: false }
}

function slopePerDay(points: { x: number; y: number }[]) {
  const n = points.length
  const mx = points.reduce((a, p) => a + p.x, 0) / n
  const my = points.reduce((a, p) => a + p.y, 0) / n
  let num = 0, den = 0
  for (const p of points) { num += (p.x - mx) * (p.y - my); den += (p.x - mx) ** 2 }
  return den ? num / den : 0
}

export interface Maintenance {
  formula: number
  kcal: number            // hedefte kullanılan bakım kalorisi
  observed?: number       // yemek + kilo trendinden hesaplanan
  loggedDays: number
  needDays: number
  adaptive: boolean
}

// Uyarlamalı bakım kalorisi: ortalama yenen − kilo trendi × 7700 (son 28 gün).
// Kayıt arttıkça formülden gerçek veriye geçer; uç değerler ±%25 ile sınırlanır.
export function maintenance(s: AppState, weightKg: number, today: string): Maintenance {
  const formula = s.profile ? Math.round(tdee(s.profile, weightKg)) : 2000
  const from = addDays(today, -WINDOW)
  const byDay: Record<string, number> = {}
  for (const f of s.foods) if (f.date > from && f.date < today) byDay[f.date] = (byDay[f.date] ?? 0) + f.kcal
  const logged = Object.values(byDay).filter((k) => k >= LOGGED_MIN_KCAL)
  const weights = s.body.filter((b) => b.date > from && b.date <= today)
  const base = { formula, kcal: formula, loggedDays: logged.length, needDays: MIN_DAYS, adaptive: false }
  if (logged.length < MIN_DAYS || weights.length < 3) return base
  const t0 = Date.parse(weights[0].date)
  const pts = weights.map((b) => ({ x: (Date.parse(b.date) - t0) / 86400000, y: b.weightKg }))
  if (pts[pts.length - 1].x < MIN_SPAN) return base
  const intake = logged.reduce((a, k) => a + k, 0) / logged.length
  const raw = intake - slopePerDay(pts) * KCAL_PER_KG
  const observed = Math.round(Math.min(formula * 1.25, Math.max(formula * 0.75, raw)))
  const w = Math.min(1, logged.length / WINDOW)
  return { ...base, observed, kcal: Math.round(formula * (1 - w) + observed * w), adaptive: true }
}

export function useEnergy() {
  const s = useStore((st) => st)
  const today = todayStr()
  const weightKg = s.body[s.body.length - 1]?.weightKg ?? 75
  const m = maintenance(s, weightKg, today)
  const tg = targets(s.profile!, weightKg, m.kcal)
  const burn = dayBurn(s, today, weightKg)
  const eaten = Math.round(s.foods.filter((f) => f.date === today).reduce((a, f) => a + f.kcal, 0))
  return { m, tg, burn, eaten, weightKg, today, activity: s.activity?.[today] }
}
