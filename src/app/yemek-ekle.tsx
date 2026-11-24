import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import { Button, Card, Chip, H1, H2, Input, Muted, NumberInput, Row, Screen, Wrap, TopBar } from '../components/ui'
import { foodByName, MEASURES, MIXES, mixFor, searchFoods, searchOpenFoodFacts, unitGramsOf, unitLabelOf, unitsFor, type Food } from '../data/foods'
import Scanner from '../components/Scanner'
import { ocrAvailable, scanAvailable } from '../lib/scan'
import { setState, todayStr, uid, useStore } from '../lib/store'
import { C, F } from '../lib/theme'
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

  const customAsFood: Food[] = customFoods.map((c) => ({ name: c.name, kcal: c.kcal, p: c.protein, c: c.carbs, f: c.fat, portion: c.portion, tags: c.recipe ? 'recipe' : 'custom' }))
  const recipes = customAsFood.filter((f) => f.tags === 'recipe')
  const results = useMemo(() => searchFoods(q, customAsFood), [q, customFoods]) // eslint-disable-line react-hooks/exhaustive-deps
  const recentUnique = useMemo(() => {
    const seen = new Set<string>(); const out: Food[] = []
    for (const r of recent) { if (seen.has(r.name)) continue; seen.add(r.name); const k = r.grams / 100; out.push({ name: r.name, kcal: r.kcal / k, p: r.protein / k, c: r.carbs / k, f: r.fat / k, portion: [r.grams, 'son seferki'] }) ; if (out.length >= 8) break }
    return out
  }, [recent])

  // yazmayı bırakınca (0.6 sn) internette de ara; eski aramaların sonucu yenisini ezmesin
  const reqId = useRef(0)
  useEffect(() => {
    const term = q.trim()
    const id = ++reqId.current
    if (term.length < 3) return
    const t = setTimeout(async () => {
      setLoading(true)
      const r = await searchOpenFoodFacts(term).catch(() => [])
      if (id !== reqId.current) return
      setOff(r.map((x) => ({ name: x.brand ? `${x.name} (${x.brand})` : x.name, kcal: x.kcal, p: x.p, c: x.c, f: x.f, portion: x.serving ? [x.serving, '1 porsiyon'] : undefined })))
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [q])

  const [unit, setUnit] = useState<string>('g')
  const [qty, setQty] = useState<number | undefined>(1)
  const pick = (f: Food) => { setSel(f); setGrams(f.portion?.[0] ?? 100); setUnit(f.portion ? 'portion' : 'g'); setQty(1) }
  // porsiyon "1 yemek kaşığı" gibi bir ölçüyse o yiyeceğe özel gramı kullan, aynı ölçüyü iki kez gösterme
  const portionMeasure = sel?.portion ? sel.portion[1].replace(/^1 /, '') : undefined
  const portionIsMeasure = MEASURES.some((m) => m[0] === portionMeasure)
  const extraUnits = sel ? unitsFor(sel).filter(([l]) => l !== portionMeasure) : []
  const unitGrams = (u: string) => (sel ? unitGramsOf(sel, u) : 1)
  const chooseUnit = (u: string) => {
    setUnit(u)
    if (u === 'g') return
    if (u === 'ml') { setQty(100); setGrams(Math.round(100 * unitGrams('ml'))); return }
    setQty(1); setGrams(Math.round(unitGrams(u)))
  }
  const setCount = (n: number | undefined) => { setQty(n); setGrams(n ? Math.round(n * unitGrams(unit) * 10) / 10 : undefined) }

  const [scan, setScan] = useState<'barcode' | 'label' | null>(null)
  type Item = { name: string; per: { kcal: number; p: number; c: number; f: number }; unit: string; label: string; uG: number; qty: number }
  const [recipe, setRecipe] = useState<{ name: string; items: Item[]; mix?: string } | null>(null)
  const [recipeSearch, setRecipeSearch] = useState(false)
  const r1 = (x: number) => Math.round(x * 10) / 10
  const itemG = (x: Item) => x.qty * x.uG
  const itemOf = (f: Food, u: string, n: number): Item => ({ name: f.name, per: { kcal: f.kcal, p: f.p, c: f.c, f: f.f }, unit: u, label: u === 'g' ? 'g' : unitLabelOf(f, u), uG: u === 'g' ? 1 : unitGramsOf(f, u), qty: n })
  const addItem = (it: Item) => recipe && setRecipe({ ...recipe, items: [...recipe.items, it] })
  const setItemQty = (i: number, n: number | undefined) => recipe && setRecipe({ ...recipe, items: recipe.items.map((x, j) => (j === i ? { ...x, qty: n ?? 0 } : x)) })
  const addToRecipe = () => {
    if (!sel || !grams || !recipe) return
    addItem(unit === 'g' ? itemOf(sel, 'g', grams) : { ...itemOf(sel, unit, qty || 1), uG: grams / (qty || 1) })
    setSel(null); setRecipeSearch(false); setQ(''); setOff(null)
  }
  const startMix = (name: string) => { setRecipe({ name, items: [], mix: MIXES.find((m) => m.name === name)?.name }); setQ(''); setOff(null) }
  const editRecipe = (name: string) => {
    const saved = customFoods.find((x) => x.name === name)
    const items: Item[] = (saved?.recipe ?? []).flatMap((x) => {
      const base = x.kcal !== undefined ? { name: x.name, kcal: x.kcal, p: x.p ?? 0, c: x.c ?? 0, f: x.f ?? 0 } : foodByName(x.name)
      if (!base) return []
      return [{ name: x.name, per: { kcal: base.kcal, p: base.p, c: base.c, f: base.f }, unit: x.unit ?? 'g', label: x.label ?? 'g', uG: x.uG ?? 1, qty: x.qty ?? x.grams }]
    })
    setRecipe({ name, items, mix: mixFor(name)?.name }); setSel(null)
  }
  const saveRecipe = () => {
    const items = recipe?.items.filter((x) => itemG(x) > 0) ?? []
    if (!recipe || !items.length) return
    const name = recipe.name.trim() || recipe.mix || 'Karışım'
    const g = items.reduce((a, x) => a + itemG(x), 0)
    const sum = (k: 'kcal' | 'p' | 'c' | 'f') => items.reduce((a, x) => a + x.per[k] * itemG(x) / 100, 0) * 100 / g
    const food = { name, kcal: r1(sum('kcal')), protein: r1(sum('p')), carbs: r1(sum('c')), fat: r1(sum('f')), portion: [Math.round(g), 'tamamı'] as [number, string],
      recipe: items.map((x) => ({ name: x.name, grams: itemG(x), kcal: x.per.kcal, p: x.per.p, c: x.per.c, f: x.per.f, unit: x.unit, label: x.label, uG: x.uG, qty: x.qty })) }
    setState((s) => ({ customFoods: [...s.customFoods.filter((x) => x.name !== name), food] }))
    setRecipe(null)
    pick({ name, kcal: food.kcal, p: food.protein, c: food.carbs, f: food.fat, portion: food.portion, tags: 'recipe' })
  }

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

  if (scan) {
    return (
      <Scanner
        mode={scan}
        onClose={() => setScan(null)}
        onProduct={(x) => { setScan(null); pick({ name: x.brand ? `${x.name} (${x.brand})` : x.name, kcal: x.kcal, p: x.p, c: x.c, f: x.f, portion: x.serving ? [x.serving, '1 porsiyon'] : undefined }) }}
        onLabel={(v) => { setScan(null); setCf({ name: q, kcal: v.kcal, p: v.p, c: v.c, f: v.f }); setCustom(true) }}
        onWantLabel={() => setScan('label')}
      />
    )
  }

  if (sel) {
    const k = (grams ?? 0) / 100
    return (
      <Screen padBottom={40}>
        <H1>{sel.name}</H1>
        <Muted style={{ marginBottom: 12 }}>{recipe ? `${recipe.name || recipe.mix || 'Karışım'} içine · ` : ''}100 g: {sel.kcal} kcal · P {sel.p} · K {sel.c} · Y {sel.f}</Muted>
        {sel.tags === 'recipe' && !recipe && <Button kind="ghost" small title="İçindekileri düzenle" style={{ alignSelf: 'flex-start', marginBottom: 10 }} onPress={() => editRecipe(sel.name)} />}
        <Card>
          {!recipe && (
            <>
              <Muted style={{ marginBottom: 6 }}>Öğün</Muted>
              <Wrap>{MEALS.map((m) => <Chip key={m.id} label={m.name} on={meal === m.id} onPress={() => setMeal(m.id)} />)}</Wrap>
              <View style={{ height: 12 }} />
            </>
          )}
          <Muted style={{ marginBottom: 6 }}>Ölçü</Muted>
          <Wrap>
            <Chip label="Gram" on={unit === 'g'} onPress={() => chooseUnit('g')} />
            <Chip label="ml" on={unit === 'ml'} onPress={() => chooseUnit('ml')} />
            {sel.portion && !portionIsMeasure && <Chip label={sel.portion[1].replace(/^1 /, '')} on={unit === 'portion'} onPress={() => chooseUnit('portion')} />}
            {extraUnits.map(([l, g]) => <Chip key={l} label={`${l} ~${g} g`} on={unit === l} onPress={() => chooseUnit(l)} />)}
            {sel.tags !== 'recipe' && MEASURES.map(([m]) => <Chip key={m} label={m} on={unit === m} onPress={() => chooseUnit(m)} />)}
          </Wrap>
          <View style={{ height: 12 }} />
          {unit === 'g' ? (
            <>
              <NumberInput label="Miktar" value={grams} onChange={setGrams} suffix="g" step={10} />
              <Wrap>{[50, 100, 150, 200, 250].map((g) => <Chip key={g} label={`${g}`} on={grams === g} onPress={() => setGrams(g)} />)}</Wrap>
            </>
          ) : unit === 'ml' ? (
            <>
              <NumberInput label="Miktar" value={qty} onChange={setCount} suffix="ml" step={50} />
              <Wrap>{[100, 200, 250, 330, 500].map((m) => <Chip key={m} label={`${m}`} on={qty === m} onPress={() => setCount(m)} />)}</Wrap>
              <Muted>≈ {grams ?? 0} g{sel.density ? '' : ' (sıvılarda 1 ml ≈ 1 g)'}</Muted>
            </>
          ) : (
            <>
              {unit === 'portion' && sel.tags === 'recipe' ? (
                <Wrap>{([[1, 'Tamamı'], [0.5, 'Yarısı'], [1 / 3, 'Üçte biri'], [0.25, 'Çeyreği']] as [number, string][]).map(([n, l]) => <Chip key={l} label={l} on={qty === n} onPress={() => setCount(n)} />)}</Wrap>
              ) : (
                <NumberInput label="Kaç tane" value={qty} onChange={setCount} step={0.5} />
              )}
              <Muted>≈ {grams ?? 0} g{MEASURES.some((m) => m[0] === unit) && !sel.density ? ' (sıvı gibi hesaplandı; tartabiliyorsan gramla gir)' : ''}</Muted>
            </>
          )}
        </Card>
        <Card>
          <Text style={{ color: C.text, fontSize: 32, fontFamily: F.semi }}>{Math.round(sel.kcal * k)} <Text style={{ fontSize: 16, color: C.muted }}>kcal</Text></Text>
          <Muted>Protein {Math.round(sel.p * k)} g · Karb {Math.round(sel.c * k)} g · Yağ {Math.round(sel.f * k)} g</Muted>
        </Card>
        <Row>
          <Button kind="ghost" title="Geri" style={{ flex: 1 }} onPress={() => setSel(null)} />
          <Button title={recipe ? 'Karışıma ekle' : 'Ekle'} style={{ flex: 2 }} onPress={recipe ? addToRecipe : save} />
        </Row>
      </Screen>
    )
  }

  if (custom) {
    return (
      <Screen padBottom={40}>
        <H1>Kendi yiyeceğini ekle</H1>
        <Muted style={{ marginBottom: 12 }}>Paketin arkasındaki 100 g değerlerini yaz{cf.kcal !== undefined ? '. Fotoğraftan okudum, paketle bir karşılaştır' : ''}.</Muted>
        {ocrAvailable() && <Button kind="secondary" small title="Etiketi fotoğrafla, ben doldurayım" style={{ marginBottom: 12 }} onPress={() => setScan('label')} />}
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

  if (recipe && !recipeSearch) {
    const tot = (k: 'kcal' | 'p' | 'c' | 'f') => Math.round(recipe.items.reduce((a, x) => a + x.per[k] * itemG(x) / 100, 0))
    const mix = MIXES.find((m) => m.name === recipe.mix)
    const have = new Set(recipe.items.map((x) => x.name))
    const short = (n: string) => n.replace(/ \(.*\)$/, '')
    const stepOf = (x: Item) => (x.unit === 'g' ? 10 : x.unit === 'ml' ? 50 : x.uG < 10 ? 1 : 0.5)
    return (
      <Screen padBottom={40}>
        <TopBar left={{ label: 'Vazgeç', onPress: () => setRecipe(null) }} />
        <H1>{recipe.mix ?? 'Karışım / tarif'}</H1>
        <Muted style={{ marginBottom: 12 }}>İçine ne koyduysan dokun, miktarını düzelt. Kaloriyi ben toplarım; kaydedince sonra tek dokunuşla eklersin.</Muted>
        {!mix && (
          <Card>
            <Muted style={{ marginBottom: 6 }}>Ne hazırlıyorsun?</Muted>
            <Wrap>{MIXES.map((m) => <Chip key={m.name} label={m.name} on={false} onPress={() => setRecipe({ ...recipe, mix: m.name, name: recipe.name || m.name })} />)}</Wrap>
          </Card>
        )}
        {mix && (
          <Card>
            <Muted style={{ marginBottom: 6 }}>İçinde ne var? Dokun, eklensin</Muted>
            <Wrap>
              {mix.items.filter(([n]) => !have.has(n)).map(([n, u, k]) => {
                const f = foodByName(n)
                if (!f) return null
                return <Chip key={n} label={`+ ${short(n)} · ${k} ${unitLabelOf(f, u)}`} on={false} onPress={() => addItem(itemOf(f, u, k))} />
              })}
            </Wrap>
          </Card>
        )}
        <Card>
          <Input label="Adı" value={recipe.name} onChangeText={(t) => setRecipe({ ...recipe, name: t })} placeholder={`Örn. ${recipe.mix ?? 'Kahvaltı smoothie'}`} />
          {recipe.items.length === 0 && <Muted>Henüz malzeme yok.</Muted>}
          {recipe.items.map((x, i) => (
            <View key={i} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: C.text, fontFamily: F.medium, flex: 1 }} numberOfLines={1}>{x.name}</Text>
                <Muted>{x.unit !== 'g' ? `${Math.round(itemG(x))} g · ` : ''}{Math.round(x.per.kcal * itemG(x) / 100)} kcal</Muted>
                <Pressable hitSlop={10} onPress={() => setRecipe({ ...recipe, items: recipe.items.filter((_, j) => j !== i) })}>
                  <Text style={{ color: C.muted, fontFamily: F.semi, marginLeft: 12 }}>Sil</Text>
                </Pressable>
              </Row>
              <NumberInput bare value={x.qty} onChange={(n) => setItemQty(i, n)} step={stepOf(x)} suffix={x.label} />
            </View>
          ))}
          <Button kind="secondary" small title={mix ? '+ Başka malzeme ara' : '+ Malzeme ekle'} style={{ marginTop: 12 }} onPress={() => { setQ(''); setOff(null); setRecipeSearch(true) }} />
        </Card>
        {recipe.items.length > 0 && (
          <Card>
            <Text style={{ color: C.text, fontSize: 32, fontFamily: F.semi }}>{tot('kcal')} <Text style={{ fontSize: 16, color: C.muted }}>kcal toplam</Text></Text>
            <Muted>Protein {tot('p')} g · Karb {tot('c')} g · Yağ {tot('f')} g · ~{Math.round(recipe.items.reduce((a, x) => a + itemG(x), 0))} g</Muted>
          </Card>
        )}
        <Button title="Kaydet, ne kadarını yediğini seç" disabled={!recipe.items.length} onPress={saveRecipe} />
      </Screen>
    )
  }

  const list = results
  return (
    <Screen scroll={false} padBottom={0} style={{ paddingBottom: 0 }}>
      {recipeSearch
        ? <TopBar left={{ label: 'Karışım', back: true, onPress: () => setRecipeSearch(false) }} />
        : <TopBar right={{ label: 'Kapat', onPress: () => router.back() }} />}
      <H1>{recipeSearch ? 'Malzeme ekle' : 'Yiyecek ekle'}</H1>
      <Input value={q} onChangeText={(t) => { setQ(t); setOff(null); setLoading(false) }} placeholder="Ara: tavuk, Pınar protein süt, muz…" autoFocus autoCorrect={false} autoComplete="off" spellCheck={false} style={{ height: 50, paddingVertical: 0 }} />
      <View style={{ flex: 1 }}>
        {q.trim() === '' ? (
          <View>
            {scanAvailable() && (
              <Row style={{ marginTop: 8 }}>
                <Button kind="secondary" small title="Barkod okut" style={{ flex: 1 }} onPress={() => setScan('barcode')} />
                {ocrAvailable() && <Button kind="secondary" small title="Etiketi fotoğrafla" style={{ flex: 1 }} onPress={() => setScan('label')} />}
              </Row>
            )}
            {!recipeSearch && recipes.length > 0 && <H2 style={{ marginTop: 8 }}>Tariflerin</H2>}
            {!recipeSearch && recipes.map((f) => <FoodRow key={f.name} f={f} onPress={() => pick(f)} />)}
            {recentUnique.length > 0 && <H2 style={{ marginTop: 8 }}>Son eklediklerin</H2>}
            {recentUnique.map((f, i) => <FoodRow key={i} f={f} onPress={() => pick(f)} />)}
            {!recipeSearch && <Button kind="secondary" title="Karışım / tarif oluştur (smoothie, salata…)" style={{ marginTop: 12 }} onPress={() => setRecipe({ name: '', items: [] })} />}
            <Button kind="ghost" title="Listede yok, kendim gireyim" style={{ marginTop: 6 }} onPress={() => setCustom(true)} />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={list}
            keyExtractor={(f, i) => `${f.name}-${i}`}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => <FoodRow f={item} onPress={() => pick(item)} />}
            ListHeaderComponent={!recipeSearch && mixFor(q) ? (
              <Card onPress={() => startMix(mixFor(q)!.name)} style={{ marginTop: 6, borderColor: C.accent, borderWidth: 1 }}>
                <Text style={{ color: C.accent, fontFamily: F.semi, fontSize: 16 }}>{mixFor(q)!.name}: içindekilerden hesapla</Text>
                <Muted>{mixFor(q)!.items.slice(0, 4).map(([n]) => n.replace(/ \(.*\)$/, '').toLocaleLowerCase('tr')).join(', ')}… dokun, miktarını gir</Muted>
              </Card>
            ) : undefined}
            ListFooterComponent={
              <View style={{ paddingBottom: 40 }}>
                <View style={{ height: 28, justifyContent: 'center', marginTop: 8 }}>
                  {loading ? <ActivityIndicator color={C.accent} /> : off !== null ? <Muted>{off.length ? 'İnternetten (Open Food Facts, değerleri paketle karşılaştır)' : 'İnternette de bulunamadı.'}</Muted> : null}
                </View>
                {(off ?? []).map((f, i) => <FoodRow key={`off-${i}`} f={f} onPress={() => pick(f)} />)}
                <Button kind="ghost" small title="Bulamadım, paketin arkasından kendim gireyim" style={{ marginTop: 10 }} onPress={() => { setCf({ name: q }); setCustom(true) }} />
              </View>
            }
          />
        )}
      </View>
    </Screen>
  )
}

function FoodRow({ f, onPress }: { f: Food; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: C.text, flex: 1, fontFamily: F.medium }} numberOfLines={1}>{f.name}</Text>
        <Text style={{ color: C.accent, fontFamily: F.semi }}>{Math.round(f.kcal)} kcal</Text>
      </Row>
      <Muted>100 g · P {f.p} · K {f.c} · Y {f.f}{f.portion ? ` · ${f.portion[1]} ≈ ${Math.round(f.kcal * f.portion[0] / 100)} kcal` : ''}</Muted>
    </Pressable>
  )
}
