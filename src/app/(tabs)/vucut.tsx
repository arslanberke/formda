import React, { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg'
import { CountUp } from '../../components/motion'
import { Button, Card, H2, Muted, NumberInput, Row, Screen } from '../../components/ui'
import { bmi, bmiLabel } from '../../lib/nutrition'
import { setState, todayStr, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'
import type { BodyEntry } from '../../lib/types'

const FIELDS: { k: keyof BodyEntry; name: string }[] = [
  { k: 'waist', name: 'Bel' }, { k: 'hip', name: 'Kalça' }, { k: 'chest', name: 'Göğüs' }, { k: 'arm', name: 'Kol' }, { k: 'thigh', name: 'Bacak' },
]

export default function Vucut() {
  const profile = useStore((s) => s.profile)!
  const body = useStore((s) => s.body)
  const last = body[body.length - 1]
  const [w, setW] = useState<number | undefined>(last?.weightKg)
  const [m, setM] = useState<Partial<BodyEntry>>({})
  const [more, setMore] = useState(false)
  const { width } = useWindowDimensions()

  const save = () => {
    if (!w || w < 30 || w > 300) return Alert.alert('Kilonu kg olarak gir')
    const today = todayStr()
    setState((s) => {
      const prev = s.body.find((b) => b.date === today)
      const entry: BodyEntry = { ...(prev ?? {}), ...Object.fromEntries(Object.entries(m).filter(([, v]) => v !== undefined)), date: today, weightKg: w }
      const body = [...s.body.filter((b) => b.date !== today), entry].sort((a, b) => a.date.localeCompare(b.date))
      return { body }
    })
    setM({})
    Alert.alert('Kaydedildi')
  }

  const first = body[0]
  const diff = last && first ? +(last.weightKg - first.weightKg).toFixed(1) : 0
  const b = last ? bmi(profile.heightCm, last.weightKg) : 0
  const last7 = body.filter((x) => x.date >= addDaysStr(-7))
  const avg7 = last7.length ? +(last7.reduce((a, x) => a + x.weightKg, 0) / last7.length).toFixed(1) : undefined

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(60).springify().damping(16)}>
        <Text style={v.kicker}>VÜCUT · ŞU AN</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {last ? <CountUp to={last.weightKg} decimals={last.weightKg % 1 ? 1 : 0} style={v.big} /> : <Text style={v.big}>—</Text>}
          <Text style={v.bigUnit}>kg</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4, marginBottom: 18 }}>
          {last && first && body.length > 1 ? <Text style={[v.pill, { color: diff < 0 ? C.accent : diff > 0 ? C.warn : C.text }]}>{diff > 0 ? '+' : ''}{diff} kg toplam</Text> : null}
          {avg7 ? <Text style={v.pill}>7 gün ort. {avg7} kg</Text> : null}
          {last ? <Text style={v.pill}>VKİ {b.toFixed(1)} · {bmiLabel(b)}</Text> : null}
        </View>
      </Animated.View>

      {body.length >= 2 && (
        <Animated.View entering={FadeInDown.delay(140).springify().damping(16)} style={{ marginBottom: 14, marginHorizontal: -4 }}>
          <Chart data={body.slice(-30)} width={width - 32} />
        </Animated.View>
      )}

      <Card>
        <H2>Bugünkü ölçüm</H2>
        <NumberInput label="Kilo" value={w} onChange={setW} suffix="kg" step={0.1} />
        {more ? FIELDS.map((f) => <NumberInput key={f.k} label={f.name} value={m[f.k] as number | undefined} onChange={(v) => setM({ ...m, [f.k]: v })} suffix="cm" />)
          : <Button small kind="ghost" title="+ Ölçüleri de gir (bel, kalça…)" onPress={() => setMore(true)} />}
        <Button title="Kaydet" style={{ marginTop: 10 }} onPress={save} />
        <Muted style={{ marginTop: 8 }}>Her sabah tuvaletten sonra, kahvaltıdan önce tartıl. Günlük dalgalanma normaldir, haftalık ortalamaya bak.</Muted>
      </Card>

      {body.length > 0 && (
        <View>
          <H2>Kayıtlar</H2>
          {[...body].reverse().slice(0, 30).map((e) => (
            <Pressable key={e.date} onLongPress={() => Alert.alert('Sil?', e.date, [{ text: 'Vazgeç' }, { text: 'Sil', style: 'destructive', onPress: () => setState((s) => ({ body: s.body.filter((x) => x.date !== e.date) })) }])}>
              <Card style={{ paddingVertical: 10 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: C.muted, fontFamily: F.body }}>{e.date.split('-').reverse().join('.')}</Text>
                  <Text style={{ color: C.text, fontFamily: F.display, fontSize: 15 }}>{e.weightKg} kg</Text>
                </Row>
                {FIELDS.some((f) => e[f.k] !== undefined) && <Muted>{FIELDS.filter((f) => e[f.k] !== undefined).map((f) => `${f.name} ${e[f.k]}`).join(' · ')}</Muted>}
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  )
}

function addDaysStr(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return todayStr(d) }

function Chart({ data, width }: { data: BodyEntry[]; width: number }) {
  const h = 190, padL = 34, padB = 22, padT = 14
  const ws = data.map((d) => d.weightKg)
  const min = Math.floor(Math.min(...ws) - 0.5), max = Math.ceil(Math.max(...ws) + 0.5)
  const x = (i: number) => padL + (i / Math.max(1, data.length - 1)) * (width - padL - 8)
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB)
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.weightKg).toFixed(1)}`).join(' ')
  const ticks = [min, (min + max) / 2, max]
  return (
    <Svg width={width} height={h}>
      <Defs>
        <LinearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.accent} stopOpacity={0.28} />
          <Stop offset="1" stopColor={C.accent} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={`${path} L${x(data.length - 1).toFixed(1)},${h - padB} L${x(0).toFixed(1)},${h - padB} Z`} fill="url(#wg)" />
      {ticks.map((t) => <React.Fragment key={t}>
        <Line x1={padL} x2={width} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 5" />
        <SvgText x={0} y={y(t) + 4} fill={C.dim} fontSize={11} fontFamily={F.body}>{t.toFixed(1)}</SvgText>
      </React.Fragment>)}
      <Path d={path} stroke={C.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => <Circle key={d.date} cx={x(i)} cy={y(d.weightKg)} r={i === data.length - 1 ? 5 : 2.5} fill={i === data.length - 1 ? C.accent : C.bg} stroke={C.accent} strokeWidth={1.5} />)}
      <SvgText x={padL} y={h - 4} fill={C.dim} fontSize={11} fontFamily={F.body}>{data[0].date.slice(5)}</SvgText>
      <SvgText x={width - 40} y={h - 4} fill={C.dim} fontSize={11} fontFamily={F.body}>{data[data.length - 1].date.slice(5)}</SvgText>
    </Svg>
  )
}

const v = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  big: { color: C.accent, fontFamily: F.displayBold, fontSize: 92, letterSpacing: -5, lineHeight: 100, marginTop: 6, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 36 },
  bigUnit: { color: C.accent, fontFamily: F.display, fontSize: 20, marginLeft: 6, marginBottom: 16, opacity: 0.8 },
  pill: { color: C.text, fontFamily: F.medium, fontSize: 12, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
})
