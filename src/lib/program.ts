import { EXERCISES, EXERCISE_MAP, hasEquipment, type Exercise } from '../data/exercises'
import type { Assessment, ExerciseProgress, Feel, Level, Pattern, Prescription, Profile, Program, ProgramDay, SetLog } from './types'

// ---------- Kapasite testi ----------
export interface TestDef {
  id: string
  pattern: Pattern
  exerciseId: string
  title: string
  kind: 'maxreps' | 'timed60' | 'hold' | 'weighted' // weighted: 8-12 tekrar yapabildiğin ağırlıkla max tekrar
  desc: string
}

export function testsFor(p: Profile): TestDef[] {
  const eq = p.equipment
  const has = (e: Parameters<typeof hasEquipment>[0]) => hasEquipment(e, eq)
  const t: TestDef[] = []
  t.push({ id: 'push', pattern: 'push', exerciseId: 'pushup', title: 'Şınav testi', kind: 'maxreps', desc: 'Formu bozmadan art arda yapabildiğin en fazla şınav. Normal şınav 0 ise "dizde" seç.' })
  t.push({ id: 'squat', pattern: 'squat', exerciseId: 'bw_squat', title: 'Squat testi', kind: 'timed60', desc: '60 saniyede yapabildiğin squat sayısı. Uyluklar yere paralel olacak.' })
  if (has(EXERCISE_MAP.pullup)) t.push({ id: 'pull', pattern: 'pull', exerciseId: 'pullup', title: 'Barfiks testi', kind: 'maxreps', desc: 'Art arda yapabildiğin barfiks. 0 da olabilir, sorun değil.' })
  else if (has(EXERCISE_MAP.db_row)) t.push({ id: 'pull', pattern: 'pull', exerciseId: 'db_row', title: 'Kürek testi', kind: 'weighted', desc: '8-12 tekrar yapabileceğini düşündüğün bir dambıl seç, tek kolla max tekrar yap.' })
  else t.push({ id: 'pull', pattern: 'pull', exerciseId: 'towel_row', title: 'Çekiş testi', kind: 'maxreps', desc: 'Kapı kolundan/havludan yapabildiğin en fazla çekiş.' })
  if (has(EXERCISE_MAP.db_rdl)) t.push({ id: 'hinge', pattern: 'hinge', exerciseId: 'db_rdl', title: 'Romen deadlift testi', kind: 'weighted', desc: 'İki dambılla 8-12 tekrar yapabileceğin ağırlığı seç, max tekrar yap.' })
  else if (has(EXERCISE_MAP.kb_deadlift)) t.push({ id: 'hinge', pattern: 'hinge', exerciseId: 'kb_deadlift', title: 'Kettlebell deadlift testi', kind: 'weighted', desc: '8-12 tekrar yapabileceğin kettlebell ile max tekrar.' })
  else if (has(EXERCISE_MAP.bb_rdl)) t.push({ id: 'hinge', pattern: 'hinge', exerciseId: 'bb_rdl', title: 'Romen deadlift testi', kind: 'weighted', desc: 'Barla 8-12 tekrar yapabileceğin ağırlığı seç, max tekrar yap.' })
  else t.push({ id: 'hinge', pattern: 'hinge', exerciseId: 'glute_bridge', title: 'Kalça köprüsü testi', kind: 'maxreps', desc: 'Üstte 1 sn bekleyerek yapabildiğin en fazla köprü.' })
  if (has(EXERCISE_MAP.db_shoulder_press)) t.push({ id: 'vpush', pattern: 'vpush', exerciseId: 'db_shoulder_press', title: 'Omuz pres testi', kind: 'weighted', desc: 'İki dambılla 8-12 tekrar yapabileceğin ağırlık, max tekrar.' })
  t.push({ id: 'core', pattern: 'core', exerciseId: 'plank', title: 'Plank testi', kind: 'hold', desc: 'Kalçan düşmeden kaç saniye durabiliyorsun?' })
  return t
}

const thr = (m: number[], f: number[]) => (sex: 'm' | 'f') => (sex === 'm' ? m : f)
const TH = {
  push: thr([5, 15, 30], [2, 8, 20]),
  squat: thr([15, 30, 45], [12, 25, 40]),
  pullup: thr([1, 5, 10], [1, 3, 6]),
  towel: thr([8, 15, 25], [6, 12, 20]),
  bridge: thr([15, 30, 45], [15, 30, 45]),
  plank: thr([20, 45, 90], [20, 45, 90]),
  // ağırlıklı testler: tahmini 1RM / vücut ağırlığı
  row1: thr([0.2, 0.35, 0.5], [0.12, 0.22, 0.35]),
  hinge: thr([0.5, 0.9, 1.3], [0.35, 0.65, 1.0]),
  vpush: thr([0.25, 0.45, 0.65], [0.15, 0.27, 0.4]),
}

function lvl(v: number, th: number[]): Level {
  if (v < th[0]) return 0
  if (v < th[1]) return 1
  if (v < th[2]) return 2
  return 3
}

export const epley = (w: number, reps: number) => (reps <= 1 ? w : w * (1 + reps / 30))

export function evaluate(p: Profile, weightKg: number, results: Record<string, number>, weights: Record<string, number>, variants: Record<string, string>): Assessment {
  const levels: Partial<Record<Pattern, Level>> = {}
  const oneRm: Partial<Record<Pattern, number>> = {}
  const s = p.sex
  const tests = testsFor(p)
  for (const t of tests) {
    const v = results[t.id] ?? 0
    switch (t.id) {
      case 'push': {
        const variant = variants.push ?? 'pushup'
        const eff = variant === 'knee_pushup' ? v * 0.5 : variant === 'incline_pushup' ? v * 0.3 : v
        levels.push = lvl(eff, TH.push(s)); break
      }
      case 'squat': levels.squat = lvl(v, TH.squat(s)); levels.lunge = levels.squat; break
      case 'core': levels.core = lvl(v, TH.plank(s)); break
      case 'pull': {
        if (t.kind === 'weighted') {
          const rm = epley(weights.pull ?? 0, v); oneRm.pull = rm
          levels.pull = lvl(rm / weightKg, TH.row1(s))
        } else if (t.exerciseId === 'pullup') levels.pull = lvl(v, TH.pullup(s))
        else levels.pull = lvl(v, TH.towel(s))
        break
      }
      case 'hinge': {
        if (t.kind === 'weighted') {
          const rm = epley(weights.hinge ?? 0, v); oneRm.hinge = rm
          levels.hinge = lvl(rm / weightKg, TH.hinge(s))
        } else levels.hinge = lvl(v, TH.bridge(s))
        break
      }
      case 'vpush': {
        const rm = epley(weights.vpush ?? 0, v); oneRm.vpush = rm
        levels.vpush = lvl(rm / weightKg, TH.vpush(s)); break
      }
    }
  }
  if (levels.vpush === undefined) levels.vpush = Math.max(0, (levels.push ?? 0) - 1) as Level
  if (levels.lunge === undefined) levels.lunge = levels.squat ?? 0
  levels.cardio = levels.squat ?? 0
  return { date: new Date().toISOString(), results, weights, levels, oneRm }
}

export const LEVEL_NAMES = ['Başlangıç', 'Yeni', 'Orta', 'İleri']

// ---------- Ağırlık artışları ----------
function sortedUniq(a: number[]) { return [...new Set(a.filter((x) => x > 0))].sort((x, y) => x - y) }

export function availableLoads(p: Profile, ex: Exercise): number[] | null {
  if (ex.load === 'dumbbell' || ex.load === 'dumbbell1') {
    const d = sortedUniq(p.dumbbells)
    return d.length ? d : null
  }
  if (ex.load === 'kettlebell') { const d = sortedUniq(p.kettlebells); return d.length ? d : null }
  if (ex.load === 'barbell') {
    const plates = sortedUniq(p.plates)
    if (!plates.length) return null
    // her plaka çifti için mümkün toplamlar (sadeleştirme: her ağırlıktan çift varsa)
    const counts = new Map<number, number>()
    for (const pl of p.plates) counts.set(pl, (counts.get(pl) ?? 0) + 1)
    let sums = new Set<number>([0])
    for (const [pl, c] of counts) {
      const pairs = Math.floor(c / 2)
      const next = new Set<number>()
      for (const s of sums) for (let k = 0; k <= pairs; k++) next.add(s + k * pl * 2)
      sums = next
    }
    return [...sums].map((s) => s + (p.barWeight || 20)).sort((a, b) => a - b)
  }
  return null
}

export function stepLoad(p: Profile, ex: Exercise, current: number, dir: 1 | -1): number {
  const loads = availableLoads(p, ex)
  if (loads) {
    if (dir === 1) return loads.find((l) => l > current + 0.01) ?? current
    return [...loads].reverse().find((l) => l < current - 0.01) ?? current
  }
  const inc = ex.load === 'barbell' ? 2.5 : ex.load === 'kettlebell' ? 4 : 2
  return Math.max(0, current + dir * inc)
}

function roundToLoad(p: Profile, ex: Exercise, target: number): number {
  const loads = availableLoads(p, ex)
  if (loads && loads.length) {
    let best = loads[0]
    for (const l of loads) if (Math.abs(l - target) < Math.abs(best - target)) best = l
    return best
  }
  const inc = ex.load === 'barbell' ? 2.5 : 1
  return Math.max(inc, Math.round(target / inc) * inc)
}

// ---------- Program üretimi ----------
const TARGET_TIER: Record<Level, number> = { 0: 1, 1: 2, 2: 3, 3: 4 }

function candidates(p: Profile, pattern: Pattern): Exercise[] {
  return EXERCISES.filter((e) => e.pattern === pattern && hasEquipment(e, p.equipment))
}

export function pickExercise(p: Profile, pattern: Pattern, level: Level, exclude: string[] = []): Exercise | null {
  const c = candidates(p, pattern).filter((e) => !exclude.includes(e.id))
  if (!c.length) return null
  const target = TARGET_TIER[level] + (level >= 2 ? 1 : 0)
  // hedef basamağa en yakın olan; eşitlikte ağırlıklı hareketi tercih et (ilerlemesi kolay)
  const scored = c.map((e) => ({ e, s: Math.abs(e.tier - target) * 10 + (e.load === 'bw' ? 1 : 0) + (e.tier > target ? 5 : 0) }))
  scored.sort((a, b) => a.s - b.s)
  return scored[0].e
}

function startWeight(p: Profile, ex: Exercise, a: Assessment, weightKg: number): number | undefined {
  if (ex.load === 'bw') return undefined
  if (ex.load === 'band') return undefined
  const rm = a.oneRm[ex.pattern]
  let target: number
  if (rm) {
    // test hareketiyle aynı yük tipi ise %70, farklıysa daha temkinli
    const sameLoad = EXERCISES.some((t) => t.pattern === ex.pattern && t.load === ex.load && a.results[ex.pattern] !== undefined)
    target = rm * (sameLoad ? 0.7 : 0.55)
    if (ex.load === 'dumbbell1' && EXERCISE_MAP.db_rdl.pattern === ex.pattern) target = rm * 0.35
  } else {
    const lv = a.levels[ex.pattern] ?? 0
    const frac: Record<Level, number> = { 0: 0.05, 1: 0.08, 2: 0.12, 3: 0.16 }
    target = weightKg * frac[lv] * (ex.load === 'barbell' ? 3 : ex.load === 'kettlebell' ? 1.6 : 1)
    if (ex.load === 'barbell') target = Math.max(target, p.barWeight || 20)
  }
  return roundToLoad(p, ex, target)
}

function startReps(ex: Exercise, a: Assessment, testMax?: number): number {
  const [lo, hi] = ex.repRange
  if (ex.load === 'bw' && testMax !== undefined && testMax > 0) {
    return Math.min(hi, Math.max(lo, Math.round(testMax * (ex.unit === 'sec' ? 0.6 : 0.5))))
  }
  const lv = a.levels[ex.pattern] ?? 0
  return lv >= 2 ? Math.round((lo + hi) / 2) : lo
}

function prescribe(p: Profile, ex: Exercise, a: Assessment, weightKg: number): Prescription {
  const lv = a.levels[ex.pattern] ?? 0
  const sets = lv === 0 ? 2 : 3
  const testMax = a.results[ex.pattern]
  const sameAsTest = testsFor(p).find((t) => t.pattern === ex.pattern)?.exerciseId === ex.id
  const reps = startReps(ex, a, sameAsTest ? testMax : undefined)
  const weightKg_ = startWeight(p, ex, a, weightKg)
  const restSec = ex.load === 'barbell' ? 120 : ex.load === 'bw' && ex.pattern === 'core' ? 45 : 75
  return { exerciseId: ex.id, sets, reps, weightKg: weightKg_, restSec }
}

export function generateProgram(p: Profile, a: Assessment, weightKg: number): Program {
  const L = (pt: Pattern) => a.levels[pt] ?? 0
  const days: ProgramDay[] = []
  const used: string[] = []
  const pick = (pt: Pattern, alt = false): Prescription | null => {
    const ex = pickExercise(p, pt, L(pt), alt ? used : [])
    if (!ex) return null
    used.push(ex.id)
    return prescribe(p, ex, a, weightKg)
  }
  const warm: Prescription = { exerciseId: 'jumping_jack', sets: 1, reps: 45, restSec: 30 }
  if (p.daysPerWeek <= 3) {
    const A: ProgramDay = { name: 'Tüm Vücut A', items: [warm, pick('squat'), pick('push'), pick('pull'), pick('hinge'), pick('core')].filter(Boolean) as Prescription[] }
    const B: ProgramDay = { name: 'Tüm Vücut B', items: [warm, pick('hinge', true), pick('vpush'), pick('pull', true), pick('lunge'), pick('core', true)].filter(Boolean) as Prescription[] }
    days.push(A, B)
    if (p.daysPerWeek === 3) {
      const Cc: ProgramDay = { name: 'Tüm Vücut C', items: [warm, pick('squat', true), pick('push', true), pick('pull'), pick('lunge', true), pick('core')].filter(Boolean) as Prescription[] }
      days.push(Cc)
    }
    return { createdAt: new Date().toISOString(), days, split: 'full' }
  }
  const U1: ProgramDay = { name: 'Üst Vücut A', items: [warm, pick('push'), pick('pull'), pick('vpush'), pick('pull', true), pick('core')].filter(Boolean) as Prescription[] }
  const L1: ProgramDay = { name: 'Alt Vücut A', items: [warm, pick('squat'), pick('hinge'), pick('lunge'), pick('core', true)].filter(Boolean) as Prescription[] }
  const U2: ProgramDay = { name: 'Üst Vücut B', items: [warm, pick('vpush', true), pick('pull', true), pick('push', true), pick('core')].filter(Boolean) as Prescription[] }
  const L2: ProgramDay = { name: 'Alt Vücut B', items: [warm, pick('hinge', true), pick('squat', true), pick('lunge', true), pick('core', true)].filter(Boolean) as Prescription[] }
  days.push(U1, L1, U2, L2)
  return { createdAt: new Date().toISOString(), days, split: 'ul' }
}

// ---------- İlerleme ----------
export interface ProgressResult { next: Prescription; message: string; swappedTo?: string }

export function progressAfterWorkout(p: Profile, target: Prescription, sets: SetLog[], feel: Feel, prog: ExerciseProgress | undefined, level: Level): { prescription: Prescription; progress: ExerciseProgress; message: string } {
  const ex = EXERCISE_MAP[target.exerciseId]
  const done = sets.filter((s) => s.done)
  const allHit = done.length >= target.sets && done.every((s) => s.reps >= target.reps)
  const [lo, hi] = ex.repRange
  const step = ex.unit === 'sec' ? 5 : 1
  let next: Prescription = { ...target }
  let message = 'Aynı hedefle devam. Formu oturt, sonra artırırız.'
  const pr: ExerciseProgress = prog ?? { exerciseId: ex.id, reps: target.reps, weightKg: target.weightKg, streakEasy: 0, streakHard: 0, updatedAt: '' }

  if (allHit && feel !== 'hard') {
    pr.streakHard = 0
    pr.streakEasy += 1
    const jump = feel === 'easy' ? step * 2 : step
    if (target.reps + jump <= hi) {
      next.reps = target.reps + jump
      message = `Hedef ${ex.unit === 'sec' ? 'süre' : 'tekrar'} ${target.reps} → ${next.reps} oldu.`
    } else if (target.weightKg !== undefined) {
      const w = stepLoad(p, ex, target.weightKg, 1)
      if (w > target.weightKg) {
        next.weightKg = w; next.reps = lo
        message = `Ağırlık ${target.weightKg} → ${w} kg çıktı, tekrar ${lo}'a indi.`
      } else { next.reps = hi; message = 'Daha ağır ekipman yok; set sayısını artırmayı düşün.' }
    } else {
      // vücut ağırlığı: bir üst basamağa geç
      const harder = EXERCISES.filter((e) => e.pattern === ex.pattern && e.tier > ex.tier && hasEquipment(e, p.equipment)).sort((a, b) => a.tier - b.tier)[0]
      if (harder) {
        next = { ...target, exerciseId: harder.id, reps: harder.repRange[0], weightKg: startWeightForSwap(p, harder, target) }
        message = `Tebrikler! ${ex.name} → ${harder.name} hareketine geçtin.`
      } else { next.reps = hi; next.sets = Math.min(5, target.sets + 1); message = 'Zirve basamak: set sayısı arttı.' }
    }
    if (pr.streakEasy >= 2 && next.sets < 4 && level >= 1) { next.sets = target.sets + 1; pr.streakEasy = 0 }
  } else if (!allHit || feel === 'hard') {
    pr.streakEasy = 0
    pr.streakHard += 1
    if (pr.streakHard >= 2) {
      pr.streakHard = 0
      if (target.weightKg !== undefined) {
        const w = stepLoad(p, ex, target.weightKg, -1)
        next.weightKg = w; message = `İki kez zorlandın; ağırlık ${target.weightKg} → ${w} kg düştü. Normal, böyle de ilerlenir.`
      } else if (target.reps - step >= lo) { next.reps = target.reps - step; message = `Hedef ${next.reps} oldu; tekrar toparlayınca artar.` }
      else {
        const easier = EXERCISES.filter((e) => e.pattern === ex.pattern && e.tier < ex.tier && hasEquipment(e, p.equipment)).sort((a, b) => b.tier - a.tier)[0]
        if (easier) { next = { ...target, exerciseId: easier.id, reps: easier.repRange[1] }; message = `${easier.name} ile sağlamlaştırıp geri döneriz.` }
      }
    } else message = 'Zor geldi, not aldım. Bir dahaki sefere aynı hedef; yine zorlanırsan hafifleteceğim.'
  }
  pr.reps = next.reps; pr.weightKg = next.weightKg; pr.exerciseId = next.exerciseId; pr.updatedAt = new Date().toISOString()
  return { prescription: next, progress: pr, message }
}

function startWeightForSwap(p: Profile, harder: Exercise, prev: Prescription): number | undefined {
  if (harder.load === 'bw' || harder.load === 'band') return undefined
  const loads = availableLoads(p, harder)
  if (loads && loads.length) return loads[Math.min(1, loads.length - 1)]
  return prev.weightKg ?? (harder.load === 'barbell' ? p.barWeight || 20 : 4)
}

export function describeSet(pres: Prescription): string {
  const ex = EXERCISE_MAP[pres.exerciseId]
  const unit = ex.unit === 'sec' ? 'sn' : 'tekrar'
  const side = ex.perSide ? ' (her taraf)' : ''
  const w = pres.weightKg !== undefined ? ` × ${pres.weightKg} kg` : ''
  return `${pres.sets} set × ${pres.reps} ${unit}${side}${w}`
}
