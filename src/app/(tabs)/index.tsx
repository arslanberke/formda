import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated'
import { Figure } from '../../components/Figure'
import { CountUp, Ring } from '../../components/motion'
import { Bar, Screen } from '../../components/ui'
import { EXERCISE_MAP } from '../../data/exercises'
import { hasMove } from '../../data/moves'
import { targets } from '../../lib/nutrition'
import { describeSet } from '../../lib/program'
import { addDays, todayStr, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'
import type { ProgramDay } from '../../lib/types'

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function estMinutes(day: ProgramDay) {
  let s = 0
  for (const it of day.items) {
    const ex = EXERCISE_MAP[it.exerciseId]
    const work = ex?.unit === 'sec' ? it.reps : it.reps * 3.5
    s += it.sets * (work + 20) + Math.max(0, it.sets - 1) * it.restSec + 60
  }
  return Math.max(5, Math.round(s / 60))
}

const enter = (i: number) => FadeInDown.delay(80 + i * 70).springify().damping(16)

export default function Home() {
  const profile = useStore((s) => s.profile)!
  const program = useStore((s) => s.program)
  const workouts = useStore((s) => s.workouts)
  const foods = useStore((s) => s.foods)
  const water = useStore((s) => s.water)
  const body = useStore((s) => s.body)
  const active = useStore((s) => s.activeWorkout)
  const today = todayStr()
  const now = new Date()
  const weightKg = body[body.length - 1]?.weightKg ?? 75
  const tg = targets(profile, weightKg)
  const todayFoods = foods.filter((f) => f.date === today)
  const kcal = Math.round(todayFoods.reduce((a, f) => a + f.kcal, 0))
  const sum = (k: 'protein' | 'carbs' | 'fat') => Math.round(todayFoods.reduce((a, f) => a + f[k], 0))
  const ml = water[today] ?? 0
  const nextDayIndex = program ? (workouts.filter((w) => w.finishedAt).length % program.days.length) : 0
  const nextDay = program?.days[nextDayIndex]
  const doneToday = workouts.some((w) => w.date === today && w.finishedAt)
  const weekStart = addDays(today, -((now.getDay() + 6) % 7))
  const thisWeek = workouts.filter((w) => w.finishedAt && w.date >= weekStart).length
  const hour = now.getHours()
  const greet = hour < 6 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'
  const hero = nextDay?.items.find((it) => hasMove(it.exerciseId))?.exerciseId
  const totalSets = nextDay?.items.reduce((a, it) => a + it.sets, 0) ?? 0
  const start = () => (active ? router.push('/workout') : router.push({ pathname: '/workout', params: { day: String(nextDayIndex) } }))
  const prev = body.length > 1 ? body[body.length - 2] : null
  const wDiff = prev ? +(weightKg - prev.weightKg).toFixed(1) : null

  return (
    <Screen>
      <Animated.View entering={enter(0)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={s.kicker}>{DAYS[now.getDay()]}, {now.getDate()} {MONTHS[now.getMonth()]}</Text>
          <Text style={s.greet}>{greet},{'\n'}{profile.name}</Text>
        </View>
        <View style={s.week}>
          {Array.from({ length: profile.daysPerWeek }).map((_, i) => (
            <View key={i} style={[s.dot, i < thisWeek && { backgroundColor: C.accent, borderColor: C.accent }]} />
          ))}
        </View>
      </Animated.View>

      <View style={{ marginTop: 26, minHeight: 300 }}>
        {hero ? (
          <Animated.View entering={FadeInRight.delay(260).springify().damping(18)} style={s.heroFig} pointerEvents="none">
            <Figure id={hero} size={300} glow />
          </Animated.View>
        ) : null}
        <Animated.View entering={enter(1)}>
          <Text style={s.kicker}>{active ? 'DEVAM EDEN' : doneToday ? 'BUGÜN TAMAM · SIRADAKİ' : 'SIRADAKİ'}{nextDay ? ` · ${nextDay.name.toLocaleUpperCase('tr')}` : ''}</Text>
        </Animated.View>
        {nextDay ? (
          <>
            <Animated.View entering={enter(2)} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <CountUp to={estMinutes(nextDay)} style={s.big} />
              <Text style={s.bigUnit}>dk</Text>
            </Animated.View>
            <Animated.View entering={enter(3)}>
              <Text style={s.sub}>{nextDay.items.length} hareket · {totalSets} set</Text>
              <View style={{ marginTop: 16, gap: 7, maxWidth: '62%' }}>
                {nextDay.items.slice(0, 5).map((it, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
                    <Text style={s.idx}>{String(i + 1).padStart(2, '0')}</Text>
                    <Text style={s.item} numberOfLines={1}>{EXERCISE_MAP[it.exerciseId]?.name}</Text>
                  </View>
                ))}
                {nextDay.items.length > 5 ? <Text style={[s.idx, { marginLeft: 26 }]}>+{nextDay.items.length - 5} hareket</Text> : null}
              </View>
            </Animated.View>
            <Animated.View entering={enter(4)}>
              <Pressable onPress={start} style={({ pressed }) => [s.cta, pressed && { transform: [{ scale: 0.97 }] }]}>
                <Text style={s.ctaTxt}>{active ? 'Antrenmana dön' : doneToday ? 'Yine de başla' : 'Antrenmana başla'}</Text>
                <View style={s.ctaArrow}><Ionicons name="arrow-forward" size={18} color={C.accent} /></View>
              </Pressable>
              <Text style={[s.idx, { marginTop: 10 }]}>{nextDay.items[0] ? `İlk: ${describeSet(nextDay.items[0])}` : ''}</Text>
            </Animated.View>
          </>
        ) : (
          <Animated.View entering={enter(2)}>
            <Text style={[s.greet, { fontSize: 30, marginTop: 8 }]}>Önce gücünü{'\n'}ölçelim.</Text>
            <Text style={[s.sub, { marginTop: 8, maxWidth: 280 }]}>5 dakikalık kapasite testiyle programın sana göre ayarlanır.</Text>
            <Pressable onPress={() => router.push('/assessment')} style={s.cta}>
              <Text style={s.ctaTxt}>Kapasite testine başla</Text>
              <View style={s.ctaArrow}><Ionicons name="arrow-forward" size={18} color={C.accent} /></View>
            </Pressable>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={enter(5)}>
        <Pressable onPress={() => router.push('/(tabs)/beslenme')} style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 18 }]}>
          <Ring size={104} stroke={9} value={kcal} max={tg.kcal} color={kcal > tg.kcal * 1.1 ? C.danger : C.accent}>
            <CountUp to={Math.max(0, tg.kcal - kcal)} style={s.ringNum} />
            <Text style={s.ringLbl}>kalan kcal</Text>
          </Ring>
          <View style={{ flex: 1, gap: 10 }}>
            {([['Protein', 'protein', tg.protein, C.accent], ['Karb', 'carbs', tg.carbs, C.carb], ['Yağ', 'fat', tg.fat, C.purple]] as const).map(([l, k, t, col]) => (
              <View key={k}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={s.macroL}>{l}</Text>
                  <Text style={s.macroV}>{sum(k)}<Text style={{ color: C.dim }}> / {t} g</Text></Text>
                </View>
                <Bar value={sum(k)} max={t} color={col} height={5} />
              </View>
            ))}
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={enter(6)} style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable onPress={() => router.push('/(tabs)/beslenme')} style={[s.card, { flex: 1 }]}>
          <Text style={s.kicker}>SU</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <CountUp to={ml / 1000} decimals={1} style={s.mid} />
            <Text style={s.midUnit}>L</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 18, borderRadius: 4, backgroundColor: ml >= ((i + 1) * tg.waterMl) / 8 ? '#9ad7ff' : 'rgba(255,255,255,0.07)' }} />
            ))}
          </View>
          <Text style={[s.idx, { marginTop: 8 }]}>hedef {(tg.waterMl / 1000).toFixed(1)} L</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/vucut')} style={[s.card, { flex: 1 }]}>
          <Text style={s.kicker}>KİLO</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <CountUp to={weightKg} decimals={weightKg % 1 ? 1 : 0} style={s.mid} />
            <Text style={s.midUnit}>kg</Text>
          </View>
          <Text style={[s.idx, { marginTop: 12, color: wDiff == null ? C.dim : wDiff <= 0 ? C.accent : C.warn }]}>
            {wDiff == null ? 'tek ölçüm' : `${wDiff > 0 ? '+' : ''}${wDiff} kg önceki`}
          </Text>
          <Text style={[s.idx, { marginTop: 4 }]}>{body[body.length - 1]?.date === today ? 'bugün tartıldın' : 'bugün tartılmadın'}</Text>
        </Pressable>
      </Animated.View>
    </Screen>
  )
}

const s = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  greet: { color: C.text, fontFamily: F.display, fontSize: 24, letterSpacing: -1, lineHeight: 29, marginTop: 6 },
  week: { flexDirection: 'row', gap: 5, marginTop: 4 },
  dot: { width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  heroFig: { position: 'absolute', right: -70, top: -10 },
  big: { color: C.accent, fontFamily: F.displayBold, fontSize: 104, letterSpacing: -6, lineHeight: 108, marginTop: 4, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 40 },
  bigUnit: { color: C.accent, fontFamily: F.display, fontSize: 20, marginLeft: 6, marginBottom: 18, opacity: 0.8 },
  sub: { color: C.muted, fontFamily: F.light, fontSize: 15 },
  idx: { color: C.dim, fontFamily: F.medium, fontSize: 12 },
  item: { color: C.text, fontFamily: F.body, fontSize: 15, flexShrink: 1 },
  cta: { marginTop: 22, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.accent, borderRadius: 999, paddingLeft: 24, paddingRight: 6, paddingVertical: 6, boxShadow: '0 10px 30px -8px rgba(217,255,61,0.45)' },
  ctaTxt: { color: C.onAccent, fontFamily: F.semi, fontSize: 16 },
  ctaArrow: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.onAccent, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: C.card, borderRadius: 28, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  ringNum: { color: C.text, fontFamily: F.display, fontSize: 22, letterSpacing: -1 },
  ringLbl: { color: C.dim, fontFamily: F.body, fontSize: 10 },
  macroL: { color: C.muted, fontFamily: F.body, fontSize: 13 },
  macroV: { color: C.text, fontFamily: F.medium, fontSize: 13 },
  mid: { color: C.text, fontFamily: F.display, fontSize: 34, letterSpacing: -1.5, marginTop: 6 },
  midUnit: { color: C.muted, fontFamily: F.body, fontSize: 14, marginLeft: 4, marginBottom: 7 },
})
