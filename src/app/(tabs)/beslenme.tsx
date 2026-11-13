import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { Bar, Button, Card, H1, H2, Muted, Row, Screen, Stat } from '../../components/ui'
import { targets } from '../../lib/nutrition'
import { addDays, setState, todayStr, useStore } from '../../lib/store'
import { C } from '../../lib/theme'
import type { Meal } from '../../lib/types'

export const MEALS: { id: Meal; name: string }[] = [
  { id: 'kahvalti', name: 'Kahvaltı' }, { id: 'ogle', name: 'Öğle' }, { id: 'aksam', name: 'Akşam' }, { id: 'ara', name: 'Ara öğün' },
]

export default function Beslenme() {
  const profile = useStore((s) => s.profile)!
  const foods = useStore((s) => s.foods)
  const water = useStore((s) => s.water)
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const [date, setDate] = useState(todayStr())
  const tg = targets(profile, weightKg)
  const day = foods.filter((f) => f.date === date)
  const sum = (k: 'kcal' | 'protein' | 'carbs' | 'fat') => Math.round(day.reduce((a, f) => a + f[k], 0))
  const kcal = sum('kcal')
  const ml = water[date] ?? 0
  const addWater = (n: number) => setState((s) => ({ water: { ...s.water, [date]: Math.max(0, (s.water[date] ?? 0) + n) } }))
  const isToday = date === todayStr()

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Button small kind="ghost" title="‹" onPress={() => setDate(addDays(date, -1))} />
        <Pressable onPress={() => setDate(todayStr())}><H1 style={{ marginBottom: 0 }}>{isToday ? 'Bugün' : date}</H1></Pressable>
        <Button small kind="ghost" title="›" disabled={isToday} onPress={() => setDate(addDays(date, 1))} />
      </Row>

      <Card style={{ marginTop: 12 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: '800' }}>{kcal}<Text style={{ fontSize: 14, color: C.muted }}> / {tg.kcal} kcal</Text></Text>
          <Muted>{tg.kcal - kcal >= 0 ? `${tg.kcal - kcal} kaldı` : `${kcal - tg.kcal} fazla`}</Muted>
        </Row>
        <Bar value={kcal} max={tg.kcal} color={kcal > tg.kcal * 1.1 ? C.danger : C.accent} height={10} />
        <Row style={{ marginTop: 12 }}>
          <Macro label="Protein" v={sum('protein')} t={tg.protein} color={C.accent2} />
          <Macro label="Karb" v={sum('carbs')} t={tg.carbs} color={C.carb} />
          <Macro label="Yağ" v={sum('fat')} t={tg.fat} color={C.purple} />
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <H2 style={{ marginBottom: 0 }}>Su</H2>
          <Text style={{ color: C.accent, fontWeight: '700' }}>{(ml / 1000).toFixed(2)} / {(tg.waterMl / 1000).toFixed(1)} L</Text>
        </Row>
        <View style={{ marginVertical: 8 }}><Bar value={ml} max={tg.waterMl} /></View>
        <Row>
          <Button small kind="secondary" title="+ 1 bardak (200)" style={{ flex: 1 }} onPress={() => addWater(200)} />
          <Button small kind="secondary" title="+ 500 ml" style={{ flex: 1 }} onPress={() => addWater(500)} />
          <Button small kind="ghost" title="−200" onPress={() => addWater(-200)} />
        </Row>
      </Card>

      {MEALS.map((m) => {
        const items = day.filter((f) => f.meal === m.id)
        const mk = Math.round(items.reduce((a, f) => a + f.kcal, 0))
        return (
          <Card key={m.id}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: items.length ? 8 : 0 }}>
              <H2 style={{ marginBottom: 0 }}>{m.name}</H2>
              <Row style={{ alignItems: 'center' }}>
                {mk > 0 && <Muted>{mk} kcal</Muted>}
                <Button small title="+ Ekle" onPress={() => router.push({ pathname: '/yemek-ekle', params: { meal: m.id, date } })} />
              </Row>
            </Row>
            {items.map((f) => (
              <Pressable key={f.id} onLongPress={() => Alert.alert('Sil?', f.name, [{ text: 'Vazgeç' }, { text: 'Sil', style: 'destructive', onPress: () => setState((s) => ({ foods: s.foods.filter((x) => x.id !== f.id) })) }])} style={{ paddingVertical: 6, borderTopWidth: 1, borderTopColor: C.border }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: C.text, flex: 1 }} numberOfLines={1}>{f.name}</Text>
                  <Text style={{ color: C.text, fontWeight: '600' }}>{Math.round(f.kcal)}</Text>
                </Row>
                <Muted>{f.grams} g · P {Math.round(f.protein)} · K {Math.round(f.carbs)} · Y {Math.round(f.fat)}</Muted>
              </Pressable>
            ))}
          </Card>
        )
      })}
      <Muted style={{ textAlign: 'center' }}>Silmek için bir yiyeceğe basılı tut.</Muted>
    </Screen>
  )
}

function Macro({ label, v, t, color }: { label: string; v: number; t: number; color: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Stat label={label} value={`${v} g`} sub={`/ ${t}`} color={color} />
      <View style={{ marginTop: 4 }}><Bar value={v} max={t} color={color} height={5} /></View>
    </View>
  )
}
