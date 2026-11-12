import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { Bar, Button, Card, H1, H2, Muted, P, Row, Screen, Stat } from '../../components/ui'
import { EXERCISE_MAP } from '../../data/exercises'
import { targets } from '../../lib/nutrition'
import { describeSet } from '../../lib/program'
import { addDays, todayStr, useStore } from '../../lib/store'
import { C } from '../../lib/theme'

export default function Home() {
  const profile = useStore((s) => s.profile)!
  const program = useStore((s) => s.program)
  const workouts = useStore((s) => s.workouts)
  const foods = useStore((s) => s.foods)
  const water = useStore((s) => s.water)
  const body = useStore((s) => s.body)
  const active = useStore((s) => s.activeWorkout)
  const today = todayStr()
  const weightKg = body[body.length - 1]?.weightKg ?? 75
  const tg = targets(profile, weightKg)
  const todayFoods = foods.filter((f) => f.date === today)
  const kcal = Math.round(todayFoods.reduce((a, f) => a + f.kcal, 0))
  const prot = Math.round(todayFoods.reduce((a, f) => a + f.protein, 0))
  const ml = water[today] ?? 0
  const nextDayIndex = program ? (workouts.filter((w) => w.finishedAt).length % program.days.length) : 0
  const nextDay = program?.days[nextDayIndex]
  const doneToday = workouts.some((w) => w.date === today && w.finishedAt)
  const weekStart = addDays(today, -((new Date().getDay() + 6) % 7))
  const thisWeek = workouts.filter((w) => w.finishedAt && w.date >= weekStart).length
  const hour = new Date().getHours()
  const greet = hour < 6 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  return (
    <Screen>
      <H1>{greet}, {profile.name}</H1>
      <Muted style={{ marginBottom: 12 }}>Bu hafta {thisWeek}/{profile.daysPerWeek} antrenman</Muted>

      <Card>
        <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <H2 style={{ marginBottom: 0 }}>{active ? 'Devam eden antrenman' : doneToday ? 'Bugün antrenman yaptın' : 'Sıradaki antrenman'}</H2>
          {nextDay && !active && <Text style={{ color: C.accent, fontWeight: '700' }}>{nextDay.name}</Text>}
        </Row>
        {active ? (
          <Button title="Antrenmana dön" onPress={() => router.push('/workout')} />
        ) : nextDay ? (
          <View>
            {nextDay.items.slice(0, 6).map((it, i) => (
              <Row key={i} style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: C.text, flex: 1 }} numberOfLines={1}>{EXERCISE_MAP[it.exerciseId]?.name}</Text>
                <Muted>{describeSet(it)}</Muted>
              </Row>
            ))}
            <Button title={doneToday ? 'Yine de başla' : 'Başla'} kind={doneToday ? 'secondary' : 'primary'} style={{ marginTop: 10 }} onPress={() => router.push({ pathname: '/workout', params: { day: String(nextDayIndex) } })} />
          </View>
        ) : (
          <Button title="Kapasite testini yap" onPress={() => router.push('/assessment')} />
        )}
      </Card>

      <Card onPress={() => router.push('/(tabs)/beslenme')}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <H2 style={{ marginBottom: 0 }}>Beslenme</H2>
          <Muted>{kcal} / {tg.kcal} kcal</Muted>
        </Row>
        <Bar value={kcal} max={tg.kcal} color={kcal > tg.kcal * 1.1 ? C.danger : C.accent} />
        <Row style={{ marginTop: 10 }}>
          <Stat label="Protein" value={`${prot} g`} sub={`hedef ${tg.protein}`} color={C.accent2} />
          <Stat label="Kalan" value={`${Math.max(0, tg.kcal - kcal)}`} sub="kcal" />
          <Stat label="Su" value={`${(ml / 1000).toFixed(1)} L`} sub={`hedef ${(tg.waterMl / 1000).toFixed(1)}`} color={C.accent} />
        </Row>
      </Card>

      <Card onPress={() => router.push('/(tabs)/vucut')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <H2 style={{ marginBottom: 0 }}>Kilo</H2>
          <Text style={{ color: C.text, fontWeight: '700', fontSize: 18 }}>{weightKg} kg</Text>
        </Row>
        {body.length > 1 && (() => {
          const prev = body[body.length - 2]
          const d = +(weightKg - prev.weightKg).toFixed(1)
          return <Muted style={{ marginTop: 4 }}>Önceki ölçüme göre {d > 0 ? '+' : ''}{d} kg</Muted>
        })()}
        {body[body.length - 1]?.date !== today && <P muted style={{ marginTop: 6 }}>Bugün tartılmadın. Sabah aç karnına tartılmak en iyisi.</P>}
      </Card>
    </Screen>
  )
}
