export type Sex = 'm' | 'f'
export type Goal = 'lose' | 'maintain' | 'gain'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active'
export type EquipmentId =
  | 'bodyweight' | 'dumbbell' | 'barbell' | 'kettlebell' | 'band' | 'pullupbar' | 'bench' | 'box' | 'treadmill' | 'bike' | 'gym'
export type Pattern = 'squat' | 'hinge' | 'push' | 'pull' | 'vpush' | 'lunge' | 'core' | 'arms' | 'cardio'
export type Level = 0 | 1 | 2 | 3 // 0 başlangıç, 1 yeni, 2 orta, 3 ileri
export type Feel = 'easy' | 'ok' | 'hard'

export interface Profile {
  name: string
  sex: Sex
  birthYear: number
  heightCm: number
  goal: Goal
  activity: Activity
  daysPerWeek: 2 | 3 | 4
  equipment: EquipmentId[]
  dumbbells: number[]   // mevcut dambıl ağırlıkları (tek dambıl, kg)
  kettlebells: number[]
  barWeight: number
  plates: number[]      // mevcut plakalar (tek taraf toplamı değil, tüm plaka listesi)
  createdAt: string
}

export interface Prescription {
  exerciseId: string
  sets: number
  reps: number        // tekrar ya da saniye (exercise.unit)
  weightKg?: number
  restSec: number
}

export interface ProgramDay { name: string; items: Prescription[] }
export interface Program { createdAt: string; days: ProgramDay[]; split: 'full' | 'ul' }

export interface Assessment {
  date: string
  results: Record<string, number>          // testId -> değer
  weights: Record<string, number>          // testId -> kullanılan ağırlık
  variants?: Record<string, string>        // testId -> seçilen hareket çeşidi
  levels: Partial<Record<Pattern, Level>>
  oneRm: Partial<Record<Pattern, number>>
}

export interface SetLog { reps: number; weightKg?: number; done: boolean }
export interface ExerciseLog { exerciseId: string; target: Prescription; sets: SetLog[]; feel?: Feel; swappedFrom?: string }
export interface WorkoutLog {
  id: string
  date: string         // YYYY-MM-DD
  startedAt: string
  finishedAt?: string
  dayIndex: number
  dayName: string
  entries: ExerciseLog[]
  note?: string
}

export interface ExerciseProgress {
  exerciseId: string
  reps: number
  weightKg?: number
  streakEasy: number
  streakHard: number
  updatedAt: string
}

export type Meal = 'kahvalti' | 'ogle' | 'aksam' | 'ara'
export interface FoodEntry {
  id: string
  date: string
  meal: Meal
  name: string
  grams: number
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface BodyEntry {
  date: string
  weightKg: number
  waist?: number
  hip?: number
  chest?: number
  arm?: number
  thigh?: number
}

export type CardioKind = 'treadmill_run' | 'treadmill_walk' | 'outdoor_run' | 'walk' | 'bike' | 'other'
export interface CardioLog {
  id: string
  date: string
  kind: CardioKind
  minutes: number
  km?: number
  avgHr?: number
  kcal?: number
  inclinePct?: number
  hkId?: string // Apple Sağlık antrenman kimliği (tekrar içe almamak için)
}

export interface AppState {
  version: 1
  profile: Profile | null
  assessment: Assessment | null
  program: Program | null
  workouts: WorkoutLog[]
  progress: Record<string, ExerciseProgress>
  foods: FoodEntry[]
  water: Record<string, number> // date -> ml
  body: BodyEntry[]
  customFoods: { name: string; kcal: number; protein: number; carbs: number; fat: number }[]
  activeWorkout: WorkoutLog | null
  cardio: CardioLog[]
  reminders?: { days: number[]; hour: number; minute: number } | null
  activity?: Record<string, DayActivity> // date -> günlük hareket
}

// Apple Watch "Hareket" halkası = aktif kalori (dinlenme hariç, adım + antrenman dahil)
export interface DayActivity { steps?: number; activeKcal?: number; source?: 'manual' | 'health' }
