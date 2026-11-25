import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { routineMinutes, type RoutineStep } from '../data/warmup'
import { C, F } from '../lib/theme'
import { Figure } from './Figure'
import { Button, Row, Screen } from './ui'

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function Routine({ kicker, title, intro, steps, skipLabel, onDone }: {
  kicker: string
  title: string
  intro: string
  steps: RoutineStep[]
  skipLabel: string
  onDone: () => void
}) {
  const [idx, setIdx] = useState<number | null>(null)
  const [left, setLeft] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (i: number) => {
    if (i >= steps.length) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); onDone(); return }
    setIdx(i); setLeft(steps[i].sec); setPaused(false)
  }

  useEffect(() => {
    if (idx === null || paused) return
    const t = setTimeout(() => {
      const s = steps[idx]
      const n = left - 1
      if (n <= 0) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); go(idx + 1); return }
      if (s.sides && n === Math.floor(s.sec / 2)) Haptics.selectionAsync().catch(() => {})
      setLeft(n)
    }, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, left])

  if (idx === null) {
    return (
      <Screen padBottom={40}>
        <Text style={st.kicker}>{kicker}</Text>
        <Text style={st.title}>{title}</Text>
        <Text style={st.sub}>{intro}</Text>
        <View style={{ marginTop: 18 }}>
          {steps.map((s, i) => (
            <View key={i} style={st.row}>
              <Text style={st.idx}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={st.rowT}>{s.name}</Text>
              <Text style={st.rowS}>{s.sec} sn</Text>
            </View>
          ))}
        </View>
        <Button title={`Başla · ${routineMinutes(steps)} dk`} style={{ marginTop: 18 }} onPress={() => go(0)} />
        <Button kind="ghost" title={skipLabel} onPress={() => onDone()} />
      </Screen>
    )
  }

  const s = steps[idx]
  const half = s.sides && left <= Math.floor(s.sec / 2)
  return (
    <Screen padBottom={40}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={st.kicker}>{kicker} · {idx + 1}/{steps.length}</Text>
        <Pressable onPress={() => onDone()} hitSlop={10}><Text style={{ color: C.muted, fontFamily: F.medium, fontSize: 14 }}>{skipLabel}</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 5, marginTop: 12 }}>
        {steps.map((_, i) => <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < idx ? C.accent : i === idx ? 'rgba(217,255,61,0.45)' : 'rgba(255,255,255,0.08)' }} />)}
      </View>
      <Animated.View key={idx} entering={FadeIn.duration(260)} style={{ alignItems: 'center', marginTop: 24 }}>
        {s.photo ? <Figure id={s.photo} size={200} glow /> : <View style={st.icon}><Ionicons name={kicker.startsWith('ISIN') ? 'flame-outline' : 'leaf-outline'} size={56} color={C.accent} /></View>}
        <Text style={[st.title, { textAlign: 'center' }]}>{s.name}</Text>
        {s.sides ? <Text style={st.side}>{half ? 'Diğer taraf' : 'İlk taraf'}</Text> : null}
        <Text style={st.timer}>{mmss(left)}</Text>
        <Text style={[st.sub, { textAlign: 'center', lineHeight: 21 }]}>{s.how}</Text>
      </Animated.View>
      <Row style={{ marginTop: 24 }}>
        <Button kind="secondary" title={paused ? 'Devam' : 'Duraklat'} style={{ flex: 1 }} onPress={() => setPaused((p) => !p)} />
        <Button title={idx === steps.length - 1 ? 'Bitir' : 'Sonraki'} style={{ flex: 1 }} onPress={() => go(idx + 1)} />
      </Row>
    </Screen>
  )
}

const st = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  title: { color: C.text, fontFamily: F.display, fontSize: 24, letterSpacing: -1, marginTop: 8 },
  sub: { color: C.muted, fontFamily: F.light, fontSize: 14, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  idx: { color: C.dim, fontFamily: F.display, fontSize: 13, width: 24 },
  rowT: { flex: 1, color: C.text, fontFamily: F.body, fontSize: 15 },
  rowS: { color: C.muted, fontFamily: F.medium, fontSize: 13 },
  icon: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(217,255,61,0.06)', borderWidth: 1, borderColor: C.border },
  side: { color: C.accent, fontFamily: F.medium, fontSize: 13, marginTop: 6 },
  timer: { color: C.accent, fontFamily: F.displayBold, fontSize: 72, letterSpacing: -3, lineHeight: 80, marginTop: 8 },
})
