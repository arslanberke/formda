export type Sex = 'm' | 'f'
export type Goal = 'lose' | 'maintain' | 'gain'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active'
export type EquipmentId =
  | 'bodyweight' | 'dumbbell' | 'barbell' | 'kettlebell' | 'band' | 'pullupbar' | 'bench' | 'box' | 'gym'
export type Pattern = 'squat' | 'hinge' | 'push' | 'pull' | 'vpush' | 'lunge' | 'core' | 'cardio'
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
  levels: Partial<Record<Pattern, Level>>
  oneRm: Partial<Record<Pattern, number>>
}

export interface SetLog { reps: number; weightKg?: number; done: boolean }
export interface ExerciseLog { exerciseId: string; target: Prescription; sets: SetLog[]; feel?: Feel }
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
}
