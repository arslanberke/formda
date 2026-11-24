import { Platform } from 'react-native'
import { getState, setState, todayStr, uid } from './store'
import type { CardioKind, CardioLog } from './types'

// Apple Sağlık sadece Mac'ten kurulan gerçek iOS uygulamasında var; Expo Go'da ve web'de modül yüklenmez.
type HK = typeof import('@kingstinct/react-native-healthkit')
let hk: HK | null = null
if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const m: HK = require('@kingstinct/react-native-healthkit')
    if (m.isHealthDataAvailable()) hk = m
  } catch { hk = null }
}

export const healthAvailable = () => hk != null

const READ = [
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKQuantityTypeIdentifierHeartRate',
  'HKWorkoutTypeIdentifier',
] as const

const startOfDay = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

async function daySum(h: HK, id: 'HKQuantityTypeIdentifierStepCount' | 'HKQuantityTypeIdentifierActiveEnergyBurned') {
  const unit = id === 'HKQuantityTypeIdentifierStepCount' ? 'count' : 'kcal'
  const r = await h.queryStatisticsForQuantity(id, ['cumulativeSum'], { filter: { date: { startDate: startOfDay(), endDate: new Date() } }, unit } as never)
  return r.sumQuantity ? Math.round(r.sumQuantity.quantity) : undefined
}

// WorkoutActivityType: cycling 13, elliptical 16, running 37, walking 52
function kindOf(type: number, indoor: boolean): CardioKind | null {
  if (type === 37) return indoor ? 'treadmill_run' : 'outdoor_run'
  if (type === 52) return indoor ? 'treadmill_walk' : 'walk'
  if (type === 13 || type === 16) return 'bike'
  return null
}

async function importWorkouts(h: HK, days = 14) {
  const from = new Date(); from.setDate(from.getDate() - days)
  const ws = await h.queryWorkoutSamples({ limit: 50, ascending: false, filter: { date: { startDate: from, endDate: new Date() } } })
  const known = new Set(getState().cardio.map((c) => c.hkId).filter(Boolean))
  const add: CardioLog[] = []
  for (const w of ws) {
    if (known.has(w.uuid)) continue
    const indoor = Boolean((w.metadata as Record<string, unknown> | undefined)?.HKIndoorWorkout)
    const kind = kindOf(Number(w.workoutActivityType), indoor)
    if (!kind) continue
    const hr = await w.getStatistic('HKQuantityTypeIdentifierHeartRate', 'count/min').catch(() => undefined)
    const kcal = w.totalEnergyBurned ? (w.totalEnergyBurned.unit === 'kcal' ? w.totalEnergyBurned.quantity : w.totalEnergyBurned.quantity / 4.184) : undefined
    const dist = w.totalDistance ? (w.totalDistance.unit === 'km' ? w.totalDistance.quantity : w.totalDistance.quantity / 1000) : undefined
    add.push({
      id: uid(), hkId: w.uuid, date: todayStr(new Date(w.startDate)), kind,
      minutes: Math.round(w.duration.quantity / (w.duration.unit === 'min' ? 1 : 60)),
      km: dist ? Math.round(dist * 100) / 100 : undefined,
      avgHr: hr?.averageQuantity ? Math.round(hr.averageQuantity.quantity) : undefined,
      kcal: kcal ? Math.round(kcal) : undefined,
    })
  }
  if (add.length) setState((s) => ({ cardio: [...s.cardio, ...add].sort((a, b) => a.date.localeCompare(b.date)) }))
  return add.length
}

// Bugünkü adım + aktif kalori ve son 2 haftanın koşu/yürüyüş/bisiklet antrenmanları
export async function importToday(): Promise<{ steps?: number; activeKcal?: number; workouts: number } | null> {
  const h = hk
  if (!h) return null
  await h.requestAuthorization({ toRead: READ })
  const [steps, activeKcal, workouts] = await Promise.all([
    daySum(h, 'HKQuantityTypeIdentifierStepCount'),
    daySum(h, 'HKQuantityTypeIdentifierActiveEnergyBurned'),
    importWorkouts(h).catch(() => 0),
  ])
  if (steps == null && activeKcal == null && !workouts) return null
  return { steps, activeKcal, workouts }
}
