import * as Haptics from 'expo-haptics'
import { useKeepAwake } from 'expo-keep-awake'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, Pressable, Text, View } from 'react-native'
import { Button, Card, Chip, H1, H2, Muted, NumberInput, P, Row, Screen } from '../components/ui'
import { EXERCISE_MAP, imgUrl } from '../data/exercises'
import { describeSet, progressAfterWorkout, stepLoad } from '../lib/program'
import { getState, setState, todayStr, uid, useStore } from '../lib/store'
import { C } from '../lib/theme'
import type { ExerciseLog, Feel, WorkoutLog } from '../lib/types'

export default function Workout() {
  useKeepAwake()
  const { day } = useLocalSearchParams<{ day?: string }>()
  const profile = useStore((s) => s.profile)!
  const program = useStore((s) => s.program)!
  const assessment = useStore((s) => s.assessment)!
  const active = useStore((s) => s.activeWorkout)
  const [cur, setCur] = useState(0)
  const [rest, setRest] = useState<number | null>(null)
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [summary, setSummary] = useState<string[] | null>(null)

  // aktif antrenman yoksa oluştur
  useEffect(() => {
    if (active) return
    const di = Math.min(program.days.length - 1, Math.max(0, parseInt(day ?? '0', 10) || 0))
    const d = program.days[di]
    const prog = getState().progress
    const entries: ExerciseLog[] = d.items.map((it) => {
      const pr = prog[it.exerciseId]
      const target = pr ? { ...it, reps: pr.reps, weightKg: pr.weightKg } : it
      return { exerciseId: it.exerciseId, target, sets: Array.from({ length: target.sets }, () => ({ reps: target.reps, weightKg: target.weightKg, done: false })) }
    })
    const w: WorkoutLog = { id: uid(), date: todayStr(), startedAt: new Date().toISOString(), dayIndex: di, dayName: d.name, entries }
    setState({ activeWorkout: w })
  }, [active, day, program])

  useEffect(() => () => { if (restRef.current) clearInterval(restRef.current) }, [])

  const startRest = (sec: number) => {
    if (restRef.current) clearInterval(restRef.current)
    setRest(sec)
    restRef.current = setInterval(() => {
      setRest((v) => {
        if (v === null) return null
        if (v <= 1) { if (restRef.current) clearInterval(restRef.current); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); return null }
        return v - 1
      })
    }, 1000)
  }

  const update = (fn: (w: WorkoutLog) => WorkoutLog) => setState((s) => ({ activeWorkout: s.activeWorkout ? fn(s.activeWorkout) : null }))

  const entries = active?.entries ?? []
  const e = entries[cur]
  const ex = e ? EXERCISE_MAP[e.exerciseId] : null
  const doneSets = entries.reduce((a, x) => a + x.sets.filter((s) => s.done).length, 0)
  const totalSets = entries.reduce((a, x) => a + x.sets.length, 0)

  if (summary) {
    return (
      <Screen padBottom={40}>
        <H1>Antrenman bitti</H1>
        <P muted style={{ marginBottom: 12 }}>{doneSets} set tamamlandı. Programın şöyle güncellendi:</P>
        {summary.map((m, i) => <Card key={i} style={{ paddingVertical: 12 }}><P>{m}</P></Card>)}
        <Button title="Tamam" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    )
  }

  if (!active || !e || !ex) return <Screen><Muted>Hazırlanıyor…</Muted></Screen>

  const toggleSet = (si: number) => {
    const wasDone = e.sets[si].done
    update((w) => { const n = structuredClone(w); n.entries[cur].sets[si].done = !wasDone; return n })
    if (!wasDone) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
      const last = si === e.sets.length - 1
      if (!last) startRest(e.target.restSec)
    }
  }
  const setReps = (si: number, v: number | undefined) => update((w) => { const n = structuredClone(w); n.entries[cur].sets[si].reps = v ?? 0; return n })
  const setW = (dir: 1 | -1) => update((w) => {
    const n = structuredClone(w)
    const en = n.entries[cur]
    const nw = stepLoad(profile, ex, en.target.weightKg ?? 0, dir)
    en.target.weightKg = nw
    en.sets.forEach((s) => { if (!s.done) s.weightKg = nw })
    return n
  })
  const setFeel = (f: Feel) => update((w) => { const n = structuredClone(w); n.entries[cur].feel = f; return n })
  const addSet = () => update((w) => { const n = structuredClone(w); const en = n.entries[cur]; en.sets.push({ reps: en.target.reps, weightKg: en.target.weightKg, done: false }); return n })

  const finish = () => {
    const w = getState().activeWorkout!
    const touched = w.entries.filter((x) => x.sets.some((s) => s.done))
    if (touched.length === 0) return Alert.alert('Hiç set yapmadın', 'Antrenmanı iptal etmek ister misin?', [{ text: 'Devam' }, { text: 'İptal et', style: 'destructive', onPress: () => { setState({ activeWorkout: null }); router.back() } }])
    const missingFeel = touched.find((x) => !x.feel)
    if (missingFeel) { setCur(w.entries.indexOf(missingFeel)); return Alert.alert('Nasıldı?', `${EXERCISE_MAP[missingFeel.exerciseId].name} için kolay / normal / zor seç; programı ona göre ayarlıyorum.`) }
    const msgs: string[] = []
    setState((s) => {
      const progress = { ...s.progress }
      const program = structuredClone(s.program!)
      for (const en of touched) {
        const level = assessment.levels[EXERCISE_MAP[en.exerciseId].pattern] ?? 0
        const r = progressAfterWorkout(profile, en.target, en.sets, en.feel!, s.progress[en.exerciseId], level)
        msgs.push(`${EXERCISE_MAP[en.exerciseId].name}: ${r.message}`)
        delete progress[en.exerciseId]
        progress[r.prescription.exerciseId] = r.progress
        program.days.forEach((d) => d.items.forEach((it, k) => { if (it.exerciseId === en.exerciseId) d.items[k] = r.prescription }))
      }
      const done: WorkoutLog = { ...w, finishedAt: new Date().toISOString() }
      return { activeWorkout: null, workouts: [...s.workouts, done], progress, program }
    })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    setSummary(msgs)
  }

  const cancel = () => Alert.alert('Antrenmanı iptal et?', 'Bu antrenman kaydedilmez.', [{ text: 'Vazgeç' }, { text: 'İptal et', style: 'destructive', onPress: () => { setState({ activeWorkout: null }); router.back() } }])

  return (
    <Screen padBottom={40}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Muted>{active.dayName}</Muted>
          <H1 style={{ marginBottom: 0 }}>{doneSets}/{totalSets} set</H1>
        </View>
        <Button small kind="ghost" title="İptal" onPress={cancel} />
      </Row>

      {/* hareket seçici */}
      <Row style={{ marginVertical: 12, flexWrap: 'wrap' }}>
        {entries.map((en, i) => {
          const d = en.sets.filter((s) => s.done).length
          const all = d === en.sets.length
          return <Pressable key={i} onPress={() => setCur(i)} style={{ width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: all ? C.accent2 : i === cur ? C.accent : C.card2, borderWidth: 1, borderColor: i === cur ? C.accent : C.border }}>
            <Text style={{ color: all || i === cur ? '#0b1020' : C.text, fontWeight: '700' }}>{i + 1}</Text>
          </Pressable>
        })}
      </Row>

      {rest !== null && (
        <Card style={{ backgroundColor: 'rgba(34,211,238,0.12)', borderWidth: 1, borderColor: C.accent, alignItems: 'center' }}>
          <Muted>Dinlen</Muted>
          <Text style={{ color: C.accent, fontSize: 48, fontWeight: '800' }}>{Math.floor(rest / 60)}:{String(rest % 60).padStart(2, '0')}</Text>
          <Row><Button small kind="ghost" title="+30 sn" onPress={() => setRest((v) => (v ?? 0) + 30)} /><Button small kind="secondary" title="Geç" onPress={() => { if (restRef.current) clearInterval(restRef.current); setRest(null) }} /></Row>
        </Card>
      )}

      <Card>
        <Pressable onPress={() => router.push(`/exercise/${ex.id}`)}>
          <Row style={{ alignItems: 'center' }}>
            <Image source={{ uri: imgUrl(ex, 0) }} style={{ width: 72, height: 72, borderRadius: 10, backgroundColor: '#fff' }} />
            <View style={{ flex: 1 }}>
              <H2 style={{ marginBottom: 2 }}>{ex.name}</H2>
              <Muted>Hedef: {describeSet(e.target)}</Muted>
              <Text style={{ color: C.accent, fontSize: 13, marginTop: 4 }}>Nasıl yapılır? ›</Text>
            </View>
          </Row>
        </Pressable>
        <Muted style={{ marginTop: 10, marginBottom: 6 }}>{ex.tips[0]}</Muted>

        {e.target.weightKg !== undefined && (
          <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
            <Muted>Ağırlık{ex.load === 'dumbbell' ? ' (tek dambıl)' : ''}</Muted>
            <Row style={{ alignItems: 'center' }}>
              <Button small kind="secondary" title="−" onPress={() => setW(-1)} />
              <Text style={{ color: C.text, fontWeight: '800', fontSize: 18, minWidth: 70, textAlign: 'center' }}>{e.target.weightKg} kg</Text>
              <Button small kind="secondary" title="+" onPress={() => setW(1)} />
            </Row>
          </Row>
        )}

        {e.sets.map((s, si) => (
          <Row key={si} style={{ alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: C.muted, width: 44 }}>Set {si + 1}</Text>
            <View style={{ flex: 1, minWidth: 0 }}>
              <NumberInput value={s.reps} onChange={(v) => setReps(si, v)} step={ex.unit === 'sec' ? 5 : 1} suffix={ex.unit === 'sec' ? 'sn' : 'tekrar'} />
            </View>
            <Pressable onPress={() => toggleSet(si)} style={{ width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: s.done ? C.accent2 : C.card2, borderWidth: 1, borderColor: s.done ? C.accent2 : C.border }}>
              <Text style={{ color: s.done ? '#0b1020' : C.text, fontSize: 20, fontWeight: '800' }}>✓</Text>
            </Pressable>
          </Row>
        ))}
        <Button small kind="ghost" title="+ set ekle" onPress={addSet} />

        {e.sets.some((s) => s.done) && (
          <View style={{ marginTop: 12 }}>
            <Muted style={{ marginBottom: 6 }}>Bu hareket nasıldı?</Muted>
            <Row>
              <Chip label="Kolay" on={e.feel === 'easy'} onPress={() => setFeel('easy')} />
              <Chip label="Normal" on={e.feel === 'ok'} onPress={() => setFeel('ok')} />
              <Chip label="Zor" on={e.feel === 'hard'} onPress={() => setFeel('hard')} />
            </Row>
          </View>
        )}
      </Card>

      <Row>
        {cur > 0 && <Button kind="ghost" title="Önceki" style={{ flex: 1 }} onPress={() => setCur(cur - 1)} />}
        {cur < entries.length - 1 ? <Button kind="secondary" title="Sonraki hareket" style={{ flex: 2 }} onPress={() => setCur(cur + 1)} /> : <Button title="Antrenmanı bitir" style={{ flex: 2 }} onPress={finish} />}
      </Row>
      {cur < entries.length - 1 && <Button kind="ghost" title="Antrenmanı bitir" style={{ marginTop: 8 }} onPress={finish} />}
    </Screen>
  )
}
