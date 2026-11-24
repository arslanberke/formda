import { addDays } from './store'
import type { AppState, Profile } from './types'

export interface Weekly {
  loggedDays: number
  avgKcal: number
  avgProtein: number
  workouts: number
  weightDelta: number | null
  tip: string
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

// Bugün yarım gün olduğu için dünden geriye 7 tam gün.
export function weekly(s: AppState, p: Profile, tg: { kcal: number; protein: number }, today: string): Weekly | null {
  const from = addDays(today, -7)
  const inWeek = (d: string) => d >= from && d < today
  const byDay = new Map<string, { kcal: number; protein: number }>()
  for (const f of s.foods) {
    if (!inWeek(f.date)) continue
    const d = byDay.get(f.date) ?? { kcal: 0, protein: 0 }
    d.kcal += f.kcal
    d.protein += f.protein
    byDay.set(f.date, d)
  }
  const days = [...byDay.values()]
  const workouts = s.workouts.filter((w) => w.finishedAt && inWeek(w.date)).length
  if (!days.length && !workouts) return null

  const cur = s.body.filter((b) => inWeek(b.date)).map((b) => b.weightKg)
  const prev = s.body.filter((b) => b.date >= addDays(from, -7) && b.date < from).map((b) => b.weightKg)
  const weightDelta = cur.length && prev.length ? +(avg(cur) - avg(prev)).toFixed(1) : null
  const avgKcal = Math.round(avg(days.map((d) => d.kcal)))
  const avgProtein = Math.round(avg(days.map((d) => d.protein)))

  let tip = 'Hedeflerine uygun gidiyorsun, aynen devam.'
  if (days.length < 4) tip = 'Yemek kaydını haftada en az 5 gün tut, ortalamalar ancak öyle doğru çıkar.'
  else if (workouts < p.daysPerWeek) tip = `Plan haftada ${p.daysPerWeek} antrenman, ${workouts} yaptın. Kısa da olsa bir gün daha ekle.`
  else if (avgProtein < tg.protein * 0.8) tip = `Protein ortalaman ${avgProtein} g, hedef ${tg.protein} g. Her öğüne yumurta, yoğurt, tavuk ya da ton balığı gibi bir protein ekle.`
  else if (p.goal === 'lose' && weightDelta != null && weightDelta >= 0 && avgKcal > tg.kcal * 1.05) tip = `Kilo düşmedi, ortalaman ${avgKcal} kcal, hedefin ${tg.kcal}. Porsiyonları biraz küçült.`
  else if (p.goal === 'lose' && weightDelta != null && weightDelta < -1) tip = 'Haftada 1 kg’dan hızlı veriyorsun. Kas kaybetmemek için biraz daha ye.'
  else if (p.goal === 'gain' && weightDelta != null && weightDelta <= 0) tip = 'Kilo artmadı. Günde 200 kcal kadar daha ekle.'

  return { loggedDays: days.length, avgKcal, avgProtein, workouts, weightDelta, tip }
}
