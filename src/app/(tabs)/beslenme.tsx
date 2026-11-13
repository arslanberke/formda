import { router } from 'expo-router'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CountUp, Ring } from '../../components/motion'
import { Muted, Screen } from '../../components/ui'
import { targets } from '../../lib/nutrition'
import { addDays, setState, todayStr, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'
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

  const left = tg.kcal - kcal
  const glasses = Math.max(1, Math.round(tg.waterMl / 250))
  const enter = (k: number) => FadeInDown.delay(60 + k * 60).springify().damping(16)
  const [y, mo, d] = date.split('-')

  return (
    <Screen>
      <Animated.View entering={enter(0)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => setDate(addDays(date, -1))} hitSlop={10} style={g.round}><Ionicons name="chevron-back" size={18} color={C.text} /></Pressable>
        <Pressable onPress={() => setDate(todayStr())} style={{ alignItems: 'center' }}>
          <Text style={g.kicker}>BESLENME</Text>
          <Text style={g.title}>{isToday ? 'Bugün' : `${d}.${mo}.${y}`}</Text>
        </Pressable>
        <Pressable onPress={() => !isToday && setDate(addDays(date, 1))} hitSlop={10} style={[g.round, isToday && { opacity: 0.3 }]}><Ionicons name="chevron-forward" size={18} color={C.text} /></Pressable>
      </Animated.View>

      <Animated.View entering={enter(1)} style={{ alignItems: 'center', marginTop: 22 }}>
        <Ring size={232} stroke={14} value={kcal} max={tg.kcal} color={kcal > tg.kcal * 1.1 ? C.danger : C.accent}>
          <CountUp to={Math.abs(left)} style={g.big} />
          <Text style={g.bigSub}>{left >= 0 ? 'kcal kaldı' : 'kcal fazla'}</Text>
          <Text style={[g.bigSub, { color: C.dim, marginTop: 2 }]}>{kcal} / {tg.kcal}</Text>
        </Ring>
      </Animated.View>

      <Animated.View entering={enter(2)} style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 22, marginBottom: 18 }}>
        {([['Protein', sum('protein'), tg.protein, C.accent], ['Karb', sum('carbs'), tg.carbs, C.carb], ['Yağ', sum('fat'), tg.fat, C.purple]] as const).map(([l, v, t, col], k) => (
          <View key={l} style={{ alignItems: 'center' }}>
            <Ring size={74} stroke={6} value={v} max={t} color={col} delay={300 + k * 120}>
              <Text style={g.macroV}>{v}</Text>
            </Ring>
            <Text style={g.macroL}>{l}</Text>
            <Text style={g.macroT}>/ {t} g</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={enter(3)} style={g.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={g.kicker}>SU</Text>
            <Text style={g.mid}>{(ml / 1000).toFixed(2)}<Text style={g.midUnit}> / {(tg.waterMl / 1000).toFixed(1)} L</Text></Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable accessibilityLabel="200 ml çıkar" onPress={() => addWater(-200)} style={g.round}><Ionicons name="remove" size={18} color={C.text} /></Pressable>
            <Pressable accessibilityLabel="200 ml ekle" onPress={() => addWater(200)} style={[g.round, { backgroundColor: '#9ad7ff', borderColor: '#9ad7ff' }]}><Ionicons name="water" size={17} color={C.onAccent} /></Pressable>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 14 }}>
          {Array.from({ length: glasses }).map((_, k) => (
            <Pressable key={k} onPress={() => setState((s) => ({ water: { ...s.water, [date]: (k + 1) * 250 } }))} style={{ flex: 1, height: 30, borderRadius: 7, backgroundColor: ml >= (k + 1) * 250 ? '#9ad7ff' : 'rgba(255,255,255,0.07)' }} />
          ))}
        </View>
        <Text style={[g.macroT, { marginTop: 8 }]}>Her kutu bir bardak (250 ml). Kutuya dokunarak ayarla.</Text>
      </Animated.View>

      {MEALS.map((m, k) => {
        const items = day.filter((f) => f.meal === m.id)
        const mk = Math.round(items.reduce((a, f) => a + f.kcal, 0))
        return (
          <Animated.View entering={enter(4 + k)} key={m.id} style={g.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={g.meal}>{m.name}</Text>
                <Text style={g.macroT}>{mk > 0 ? `${mk} kcal · ${items.length} öğe` : 'henüz bir şey yok'}</Text>
              </View>
              <Pressable accessibilityLabel={`${m.name} ekle`} onPress={() => router.push({ pathname: '/yemek-ekle', params: { meal: m.id, date } })} style={[g.round, { backgroundColor: C.accent, borderColor: C.accent }]}>
                <Ionicons name="add" size={22} color={C.onAccent} />
              </Pressable>
            </View>
            {items.map((f) => (
              <Pressable key={f.id} onLongPress={() => Alert.alert('Sil?', f.name, [{ text: 'Vazgeç' }, { text: 'Sil', style: 'destructive', onPress: () => setState((s) => ({ foods: s.foods.filter((x) => x.id !== f.id) })) }])} style={{ paddingVertical: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={g.food} numberOfLines={1}>{f.name}</Text>
                  <Text style={g.foodK}>{Math.round(f.kcal)}</Text>
                </View>
                <Text style={g.macroT}>{f.grams} g · P {Math.round(f.protein)} · K {Math.round(f.carbs)} · Y {Math.round(f.fat)}</Text>
              </Pressable>
            ))}
          </Animated.View>
        )
      })}
      <Muted style={{ textAlign: 'center' }}>Silmek için bir yiyeceğe basılı tut.</Muted>
    </Screen>
  )
}

const g = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  title: { color: C.text, fontFamily: F.display, fontSize: 22, letterSpacing: -1, marginTop: 4 },
  round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card2, borderWidth: 1, borderColor: C.border },
  big: { color: C.accent, fontFamily: F.displayBold, fontSize: 54, letterSpacing: -3, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 30 },
  bigSub: { color: C.muted, fontFamily: F.body, fontSize: 13 },
  macroV: { color: C.text, fontFamily: F.display, fontSize: 16, letterSpacing: -0.5 },
  macroL: { color: C.text, fontFamily: F.medium, fontSize: 13, marginTop: 8 },
  macroT: { color: C.dim, fontFamily: F.body, fontSize: 12, marginTop: 2 },
  card: { backgroundColor: C.card, borderRadius: 28, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  mid: { color: C.text, fontFamily: F.display, fontSize: 28, letterSpacing: -1.2, marginTop: 6 },
  midUnit: { color: C.muted, fontFamily: F.body, fontSize: 14, letterSpacing: 0 },
  meal: { color: C.text, fontFamily: F.display, fontSize: 17, letterSpacing: -0.6 },
  food: { color: C.text, fontFamily: F.body, fontSize: 15, flex: 1, marginRight: 8 },
  foodK: { color: C.text, fontFamily: F.display, fontSize: 15 },
})
