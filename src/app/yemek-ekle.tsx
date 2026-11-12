import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { Button, Card, Chip, H1, H2, Input, Muted, NumberInput, Row, Screen, Wrap } from '../components/ui'
import { searchFoods, searchOpenFoodFacts, type Food } from '../data/foods'
import { setState, todayStr, uid, useStore } from '../lib/store'
import { C } from '../lib/theme'
import type { Meal } from '../lib/types'
import { MEALS } from './(tabs)/beslenme'

export default function FoodAdd() {
  const params = useLocalSearchParams<{ meal?: string; date?: string }>()
  const [meal, setMeal] = useState<Meal>((params.meal as Meal) || 'ara')
  const date = params.date || todayStr()
  const customFoods = useStore((s) => s.customFoods)
  const foods = useStore((s) => s.foods)
  const recent = useMemo(() => foods.slice(-60).reverse(), [foods])
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Food | null>(null)
  const [grams, setGrams] = useState<number | undefined>(100)
  const [off, setOff] = useState<Food[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [custom, setCustom] = useState(false)
  const [cf, setCf] = useState<{ name: string; kcal?: number; p?: number; c?: number; f?: number }>({ name: '' })

  const customAsFood: Food[] = customFoods.map((c) => ({ name: c.name, kcal: c.kcal, p: c.protein, c: c.carbs, f: c.fat, tags: 'custom' }))
  const results = useMemo(() => searchFoods(q, customAsFood), [q, customFoods]) // eslint-disable-line react-hooks/exhaustive-deps
  const recentUnique = useMemo(() => {
    const seen = new Set<string>(); const out: Food[] = []
    for (const r of recent) { if (seen.has(r.name)) continue; seen.add(r.name); const k = r.grams / 100; out.push({ name: r.name, kcal: r.kcal / k, p: r.protein / k, c: r.carbs / k, f: r.fat / k, portion: [r.grams, 'son seferki'] }) ; if (out.length >= 8) break }
    return out
  }, [recent])

  const searchOff = async () => {
    setLoading(true)
    try {
      const r = await searchOpenFoodFacts(q)
      setOff(r.map((x) => ({ name: x.brand ? `${x.name} (${x.brand})` : x.name, kcal: x.kcal, p: x.p, c: x.c, f: x.f, portion: x.serving ? [x.serving, '1 porsiyon'] : undefined })))
    } catch { setOff([]) } finally { setLoading(false) }
  }

  const pick = (f: Food) => { setSel(f); setGrams(f.portion?.[0] ?? 100) }

  const save = () => {
    if (!sel || !grams) return
    const k = grams / 100
    setState((s) => ({ foods: [...s.foods, { id: uid(), date, meal, name: sel.name, grams, kcal: sel.kcal * k, protein: sel.p * k, carbs: sel.c * k, fat: sel.f * k }] }))
    router.back()
  }

  const saveCustom = () => {
    if (!cf.name.trim() || cf.kcal === undefined) return
    const food = { name: cf.name.trim(), kcal: cf.kcal, protein: cf.p ?? 0, carbs: cf.c ?? 0, fat: cf.f ?? 0 }
    setState((s) => ({ customFoods: [...s.customFoods.filter((x) => x.name !== food.name), food] }))
    setCustom(false)
    pick({ name: food.name, kcal: food.kcal, p: food.protein, c: food.carbs, f: food.fat })
  }

  if (sel) {
    const k = (grams ?? 0) / 100
    return (
      <Screen padBottom={40}>
        <H1>{sel.name}</H1>
        <Muted style={{ marginBottom: 12 }}>100 g: {sel.kcal} kcal · P {sel.p} · K {sel.c} · Y {sel.f}</Muted>
        <Card>
          <Muted style={{ marginBottom: 6 }}>Öğün</Muted>
          <Wrap>{MEALS.map((m) => <Chip key={m.id} label={m.name} on={meal === m.id} onPress={() => setMeal(m.id)} />)}</Wrap>
          <View style={{ height: 12 }} />
          <NumberInput label="Miktar" value={grams} onChange={setGrams} suffix="g / ml" step={10} />
          <Wrap>
            {sel.portion && <Chip label={`${sel.portion[1]} (${sel.portion[0]} g)`} on={grams === sel.portion[0]} onPress={() => setGrams(sel.portion![0])} />}
            {[50, 100, 150, 200, 250].map((g) => <Chip key={g} label={`${g}`} on={grams === g} onPress={() => setGrams(g)} />)}
          </Wrap>
        </Card>
        <Card>
          <Text style={{ color: C.text, fontSize: 32, fontWeight: '800' }}>{Math.round(sel.kcal * k)} <Text style={{ fontSize: 16, color: C.muted }}>kcal</Text></Text>
          <Muted>Protein {Math.round(sel.p * k)} g · Karb {Math.round(sel.c * k)} g · Yağ {Math.round(sel.f * k)} g</Muted>
        </Card>
        <Row>
          <Button kind="ghost" title="Geri" style={{ flex: 1 }} onPress={() => setSel(null)} />
          <Button title="Ekle" style={{ flex: 2 }} onPress={save} />
        </Row>
      </Screen>
    )
  }

  if (custom) {
    return (
      <Screen padBottom={40}>
        <H1>Kendi yiyeceğini ekle</H1>
        <Muted style={{ marginBottom: 12 }}>Paketin arkasındaki 100 g değerlerini yaz.</Muted>
        <Card>
          <Input label="Adı" value={cf.name} onChangeText={(t) => setCf({ ...cf, name: t })} placeholder="Örn. Eti Form" />
          <NumberInput label="Kalori (100 g)" value={cf.kcal} onChange={(v) => setCf({ ...cf, kcal: v })} suffix="kcal" />
          <NumberInput label="Protein" value={cf.p} onChange={(v) => setCf({ ...cf, p: v })} suffix="g" />
          <NumberInput label="Karbonhidrat" value={cf.c} onChange={(v) => setCf({ ...cf, c: v })} suffix="g" />
          <NumberInput label="Yağ" value={cf.f} onChange={(v) => setCf({ ...cf, f: v })} suffix="g" />
        </Card>
        <Row>
          <Button kind="ghost" title="Geri" style={{ flex: 1 }} onPress={() => setCustom(false)} />
          <Button title="Kaydet" style={{ flex: 2 }} onPress={saveCustom} />
        </Row>
      </Screen>
    )
  }

  const list = off ?? results
  return (
    <Screen scroll={false} padBottom={0} style={{ paddingBottom: 0 }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <H1 style={{ marginBottom: 0 }}>Yiyecek ekle</H1>
        <Button small kind="ghost" title="Kapat" onPress={() => router.back()} />
      </Row>
      <Input value={q} onChangeText={(t) => { setQ(t); setOff(null) }} placeholder="Ara: tavuk, ekmek, ayran…" autoFocus autoCorrect={false} />
      <View style={{ flex: 1 }}>
        {q.trim() === '' ? (
          <View>
            {recentUnique.length > 0 && <H2 style={{ marginTop: 8 }}>Son eklediklerin</H2>}
            {recentUnique.map((f, i) => <FoodRow key={i} f={f} onPress={() => pick(f)} />)}
            <Button kind="secondary" title="Listede yok, kendim gireyim" style={{ marginTop: 12 }} onPress={() => setCustom(true)} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {list.map((f, i) => <FoodRow key={i} f={f} onPress={() => pick(f)} />)}
            {list.length === 0 && !loading && <Muted style={{ marginTop: 12 }}>{off ? 'İnternette de bulunamadı.' : 'Listede yok.'}</Muted>}
            {loading && <ActivityIndicator color={C.accent} style={{ marginTop: 12 }} />}
            {!off && <Button kind="secondary" small title="İnternette ara (paketli ürünler)" style={{ marginTop: 10 }} onPress={searchOff} />}
            <Button kind="ghost" small title="Kendim gireyim" style={{ marginTop: 6 }} onPress={() => { setCf({ name: q }); setCustom(true) }} />
          </View>
        )}
      </View>
    </Screen>
  )
}

function FoodRow({ f, onPress }: { f: Food; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: C.text, flex: 1, fontWeight: '600' }} numberOfLines={1}>{f.name}</Text>
        <Text style={{ color: C.accent, fontWeight: '700' }}>{Math.round(f.kcal)} kcal</Text>
      </Row>
      <Muted>100 g · P {f.p} · K {f.c} · Y {f.f}{f.portion ? ` · ${f.portion[1]} ≈ ${Math.round(f.kcal * f.portion[0] / 100)} kcal` : ''}</Muted>
    </Pressable>
  )
}
