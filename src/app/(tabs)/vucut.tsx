import React, { useState } from 'react'
import { Alert, Pressable, Text, View, useWindowDimensions } from 'react-native'
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg'
import { Button, Card, H1, H2, Muted, NumberInput, Row, Screen, Stat } from '../../components/ui'
import { bmi, bmiLabel } from '../../lib/nutrition'
import { setState, todayStr, useStore } from '../../lib/store'
import { C } from '../../lib/theme'
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
      <H1>Vücut</H1>
      <Card>
        <Row>
          <Stat label="Şu an" value={last ? `${last.weightKg} kg` : '—'} />
          <Stat label="7 gün ort." value={avg7 ? `${avg7} kg` : '—'} />
          <Stat label="Toplam" value={last && first ? `${diff > 0 ? '+' : ''}${diff} kg` : '—'} color={diff < 0 ? C.accent2 : diff > 0 ? C.warn : undefined} />
        </Row>
        {last && <Muted style={{ marginTop: 8 }}>VKİ {b.toFixed(1)} · {bmiLabel(b)}</Muted>}
      </Card>

      {body.length >= 2 && (
        <Card>
          <H2>Kilo grafiği</H2>
          <Chart data={body.slice(-30)} width={width - 32 - 32} />
        </Card>
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
                  <Text style={{ color: C.text }}>{e.date}</Text>
                  <Text style={{ color: C.text, fontWeight: '700' }}>{e.weightKg} kg</Text>
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
  const h = 160, padL = 36, padB = 20, padT = 10
  const ws = data.map((d) => d.weightKg)
  const min = Math.floor(Math.min(...ws) - 0.5), max = Math.ceil(Math.max(...ws) + 0.5)
  const x = (i: number) => padL + (i / Math.max(1, data.length - 1)) * (width - padL - 8)
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB)
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.weightKg).toFixed(1)}`).join(' ')
  const ticks = [min, (min + max) / 2, max]
  return (
    <Svg width={width} height={h}>
      {ticks.map((t) => <React.Fragment key={t}>
        <Line x1={padL} x2={width} y1={y(t)} y2={y(t)} stroke={C.border} strokeWidth={1} />
        <SvgText x={0} y={y(t) + 4} fill={C.muted} fontSize={11}>{t.toFixed(1)}</SvgText>
      </React.Fragment>)}
      <Path d={path} stroke={C.accent} strokeWidth={2.5} fill="none" />
      {data.map((d, i) => <Circle key={d.date} cx={x(i)} cy={y(d.weightKg)} r={3} fill={C.accent} />)}
      <SvgText x={padL} y={h - 4} fill={C.muted} fontSize={11}>{data[0].date.slice(5)}</SvgText>
      <SvgText x={width - 40} y={h - 4} fill={C.muted} fontSize={11}>{data[data.length - 1].date.slice(5)}</SvgText>
    </Svg>
  )
}
