import * as Haptics from 'expo-haptics'
import { useKeepAwake } from 'expo-keep-awake'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Figure } from '../components/Figure'
import { Sheet } from '../components/Sheet'
import { Button, Chip, Muted, NumberInput, Row, Screen } from '../components/ui'
import { EXERCISE_MAP } from '../data/exercises'
import { hasMove } from '../data/moves'
import { describeSet, progressAfterWorkout, stepLoad } from '../lib/program'
import { getState, setState, todayStr, uid, useStore } from '../lib/store'
import { C, F } from '../lib/theme'
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
  const [askFeel, setAskFeel] = useState(false)

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
        <Animated.Text entering={FadeInDown.springify()} style={st.kicker}>ANTRENMAN BİTTİ</Animated.Text>
        <Animated.View entering={FadeInDown.delay(80).springify()} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={st.big}>{doneSets}</Text><Text style={st.bigUnit}>set</Text>
        </Animated.View>
        <Text style={[st.sub, { marginBottom: 18 }]}>Programın şöyle güncellendi:</Text>
        {summary.map((m, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(160 + i * 60).springify()} style={st.tile}>
            <Text style={st.tileTxt}>{m}</Text>
          </Animated.View>
        ))}
        <Button title="Tamam" style={{ marginTop: 10 }} onPress={() => router.replace('/(tabs)')} />
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
      else if (!e.feel) setTimeout(() => setAskFeel(true), 250)
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

  const big = hasMove(ex.id)
  const skipRest = () => { if (restRef.current) clearInterval(restRef.current); setRest(null) }
  const feelOpts: [Feel, string, string][] = [['easy', 'Kolaydı', 'Daha fazlasını yapabilirdim'], ['ok', 'Tam kararında', 'Son tekrarlar zorladı'], ['hard', 'Zordu', 'Zar zor bitirdim / tamamlayamadım']]

  return (
    <Screen padBottom={40}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={cancel} hitSlop={10} style={st.round}><Ionicons name="close" size={20} color={C.muted} /></Pressable>
        <Text style={st.kicker}>{active.dayName.toLocaleUpperCase('tr')}</Text>
        <Pressable onPress={finish} hitSlop={10} style={[st.round, { width: undefined, paddingHorizontal: 16 }]}><Text style={{ color: C.accent, fontFamily: F.semi, fontSize: 14 }}>Bitir</Text></Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 18 }}>
        <Text style={st.big}>{doneSets}</Text>
        <Text style={st.bigUnit}>/ {totalSets} set</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
        {entries.map((en, i) => {
          const d = en.sets.filter((x) => x.done).length
          return (
            <Pressable key={i} onPress={() => setCur(i)} hitSlop={{ top: 12, bottom: 12 }} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', borderWidth: i === cur ? 1 : 0, borderColor: C.text }}>
              <View style={{ width: `${(d / en.sets.length) * 100}%`, height: '100%', backgroundColor: C.accent }} />
            </Pressable>
          )
        })}
      </View>

      <Animated.View key={cur} entering={FadeIn.duration(280)}>
        <Pressable onPress={() => router.push(`/exercise/${ex.id}`)} style={{ alignItems: 'center', marginTop: big ? 0 : 18 }}>
          <Figure id={ex.id} size={big ? 300 : 210} glow />
        </Pressable>
        <Text style={st.kicker}>HAREKET {cur + 1}/{entries.length}</Text>
        <Text style={st.name}>{ex.name}</Text>
        <Text style={st.sub}>Hedef: {describeSet(e.target)}</Text>
        <Pressable onPress={() => router.push(`/exercise/${ex.id}`)}><Text style={st.tip}>{ex.tips[0]}  <Text style={{ color: C.accent }}>Nasıl yapılır ›</Text></Text></Pressable>

        {e.target.weightKg !== undefined && (
          <View style={[st.tile, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }]}>
            <Text style={st.tileTxt}>Ağırlık{ex.load === 'dumbbell' ? ' (tek dambıl)' : ''}</Text>
            <Row style={{ alignItems: 'center' }}>
              <Pressable style={st.round} onPress={() => setW(-1)}><Ionicons name="remove" size={18} color={C.text} /></Pressable>
              <Text style={{ color: C.text, fontFamily: F.display, fontSize: 18, minWidth: 76, textAlign: 'center' }}>{e.target.weightKg} kg</Text>
              <Pressable style={st.round} onPress={() => setW(1)}><Ionicons name="add" size={18} color={C.text} /></Pressable>
            </Row>
          </View>
        )}

        <View style={{ marginTop: 12 }}>
          {e.sets.map((x, si) => (
            <View key={si} style={[st.tile, { flexDirection: 'row', alignItems: 'center', gap: 10 }, x.done && { borderColor: 'rgba(217,255,61,0.35)', backgroundColor: 'rgba(217,255,61,0.06)' }]}>
              <Text style={[st.setIdx, x.done && { color: C.accent }]}>{String(si + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <NumberInput value={x.reps} onChange={(v) => setReps(si, v)} step={ex.unit === 'sec' ? 5 : 1} suffix={ex.unit === 'sec' ? 'sn' : 'tekrar'} bare />
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Set ${si + 1} tamam`} onPress={() => toggleSet(si)} style={[st.check, x.done && { backgroundColor: C.accent, borderColor: C.accent }]}>
                <Ionicons name="checkmark" size={24} color={x.done ? C.onAccent : C.muted} />
              </Pressable>
            </View>
          ))}
          <Button small kind="ghost" title="+ set ekle" onPress={addSet} />
        </View>

        {e.sets.some((x) => x.done) && (
          <View style={{ marginTop: 6 }}>
            <Muted style={{ marginBottom: 8 }}>Bu hareket nasıldı?</Muted>
            <Row>
              <Chip label="Kolay" on={e.feel === 'easy'} onPress={() => setFeel('easy')} />
              <Chip label="Normal" on={e.feel === 'ok'} onPress={() => setFeel('ok')} />
              <Chip label="Zor" on={e.feel === 'hard'} onPress={() => setFeel('hard')} />
            </Row>
          </View>
        )}
      </Animated.View>

      <Row style={{ marginTop: 18 }}>
        {cur > 0 && <Button kind="ghost" title="Önceki" style={{ flex: 1 }} onPress={() => setCur(cur - 1)} />}
        {cur < entries.length - 1 ? <Button kind="secondary" title="Sonraki hareket" style={{ flex: 2 }} onPress={() => setCur(cur + 1)} /> : <Button title="Antrenmanı bitir" style={{ flex: 2 }} onPress={finish} />}
      </Row>

      <Sheet visible={rest !== null} onClose={skipRest}>
        <Text style={[st.kicker, { textAlign: 'center' }]}>DİNLEN</Text>
        <Text style={[st.big, { textAlign: 'center', fontSize: 92, lineHeight: 100 }]}>{rest !== null ? `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}` : ''}</Text>
        <Text style={[st.sub, { textAlign: 'center', marginBottom: 18 }]}>Sıradaki: Set {Math.min(e.sets.length, e.sets.filter((x) => x.done).length + 1)} · {describeSet(e.target)}</Text>
        <Row>
          <Button kind="secondary" title="+30 sn" style={{ flex: 1 }} onPress={() => setRest((v) => (v ?? 0) + 30)} />
          <Button title="Hazırım" style={{ flex: 1 }} onPress={skipRest} />
        </Row>
      </Sheet>

      <Sheet visible={askFeel} onClose={() => setAskFeel(false)}>
        <Text style={st.kicker}>{ex.name.toLocaleUpperCase('tr')}</Text>
        <Text style={[st.name, { marginBottom: 16 }]}>Nasıl geçti?</Text>
        {feelOpts.map(([f, t, d]) => (
          <Pressable key={f} onPress={() => { setFeel(f); setAskFeel(false); Haptics.selectionAsync().catch(() => {}) }} style={({ pressed }) => [st.tile, { flexDirection: 'row', alignItems: 'center' }, pressed && { backgroundColor: 'rgba(217,255,61,0.12)' }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontFamily: F.semi, fontSize: 16 }}>{t}</Text>
              <Text style={st.sub}>{d}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.dim} />
          </Pressable>
        ))}
        <Text style={[st.sub, { fontSize: 12, marginTop: 4 }]}>Bir sonraki antrenmanda ağırlığı/tekrarı buna göre ayarlıyorum.</Text>
      </Sheet>
    </Screen>
  )
}

const st = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  big: { color: C.accent, fontFamily: F.displayBold, fontSize: 76, letterSpacing: -4, lineHeight: 82, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 36 },
  bigUnit: { color: C.muted, fontFamily: F.display, fontSize: 18, marginLeft: 8, marginBottom: 14 },
  name: { color: C.text, fontFamily: F.display, fontSize: 24, letterSpacing: -1, marginTop: 6 },
  sub: { color: C.muted, fontFamily: F.light, fontSize: 14, marginTop: 4 },
  tip: { color: C.dim, fontFamily: F.body, fontSize: 13, lineHeight: 19, marginTop: 10 },
  tile: { backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10 },
  tileTxt: { color: C.text, fontFamily: F.body, fontSize: 15, lineHeight: 21 },
  setIdx: { color: C.dim, fontFamily: F.display, fontSize: 15, width: 28 },
  check: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, backgroundColor: C.card2 },
  round: { height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card2, borderWidth: 1, borderColor: C.border },
})
