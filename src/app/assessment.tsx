import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, Text, View } from 'react-native'
import { Button, Card, Chip, H1, H2, Muted, NumberInput, P, Row, Screen, Wrap } from '../components/ui'
import { EXERCISE_MAP, imgUrl } from '../data/exercises'
import { evaluate, generateProgram, LEVEL_NAMES, testsFor, availableLoads } from '../lib/program'
import { getState, setState, useStore } from '../lib/store'
import { C } from '../lib/theme'
import { PATTERN_NAMES } from '../data/exercises'
import type { Pattern } from '../lib/types'

export default function Assessment() {
  const profile = useStore((s) => s.profile)!
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const tests = testsFor(profile)
  const [i, setI] = useState(-1)
  const [results, setResults] = useState<Record<string, number>>({})
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [variants, setVariants] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const t = tests[i]
  const ex = t ? EXERCISE_MAP[variants[t.id] ?? t.exerciseId] : null

  // 60 sn sayaç
  const [timer, setTimer] = useState<number | null>(null)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => () => { if (ref.current) clearInterval(ref.current) }, [])
  const startTimer = (sec: number, countUp = false) => {
    if (ref.current) clearInterval(ref.current)
    setTimer(countUp ? 0 : sec)
    ref.current = setInterval(() => {
      setTimer((v) => {
        if (v === null) return v
        if (countUp) return v + 1
        if (v <= 1) { if (ref.current) clearInterval(ref.current); return 0 }
        return v - 1
      })
    }, 1000)
  }
  const stopTimer = () => { if (ref.current) clearInterval(ref.current); const v = timer; setTimer(null); return v }

  const finish = () => {
    const a = evaluate(profile, weightKg, results, weights, variants)
    const program = generateProgram(profile, a, weightKg)
    setState({ assessment: a, program, progress: {} })
    setDone(true)
  }

  if (done) {
    const a = getState().assessment!
    const prog = getState().program!
    return (
      <Screen padBottom={40}>
        <H1>Sonuçların</H1>
        <P muted style={{ marginBottom: 12 }}>Bunlar başlangıç noktan. Her antrenman sonrası güncellenir.</P>
        <Card>
          {(Object.keys(a.levels) as Pattern[]).filter((k) => k !== 'cardio').map((k) => (
            <Row key={k} style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: C.text }}>{PATTERN_NAMES[k]}</Text>
              <Row>
                {[0, 1, 2, 3].map((l) => <View key={l} style={{ width: 18, height: 8, borderRadius: 4, backgroundColor: l <= (a.levels[k] ?? 0) ? C.accent : C.card2 }} />)}
                <Text style={{ color: C.accent, fontWeight: '700', width: 80, textAlign: 'right' }}>{LEVEL_NAMES[a.levels[k] ?? 0]}</Text>
              </Row>
            </Row>
          ))}
        </Card>
        <H2>Programın: {prog.split === 'full' ? 'Tüm vücut' : 'Üst / Alt'} · haftada {profile.daysPerWeek} gün</H2>
        {prog.days.map((d, di) => (
          <Card key={di}>
            <Text style={{ color: C.accent, fontWeight: '700', marginBottom: 6 }}>{d.name}</Text>
            {d.items.map((it, k) => (
              <Text key={k} style={{ color: C.text, marginBottom: 2 }}>• {EXERCISE_MAP[it.exerciseId].name} — {it.sets}×{it.reps}{EXERCISE_MAP[it.exerciseId].unit === 'sec' ? ' sn' : ''}{it.weightKg !== undefined ? ` @ ${it.weightKg} kg` : ''}</Text>
            ))}
          </Card>
        ))}
        <Button title="Başlayalım" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    )
  }

  if (i === -1) {
    return (
      <Screen padBottom={40}>
        <H1>Kapasite testi</H1>
        <P muted style={{ marginBottom: 12 }}>{tests.length} test. Her birinde elinden gelenin en iyisini yap ama formu bozma; sakatlanmak yok.</P>
        {tests.map((tt, k) => (
          <Card key={tt.id}>
            <Text style={{ color: C.text, fontWeight: '700' }}>{k + 1}. {tt.title}</Text>
            <Muted>{tt.desc}</Muted>
          </Card>
        ))}
        <Muted style={{ marginBottom: 12 }}>Önce 3-5 dk ısın: yerinde yürüyüş, kol çevirme, birkaç hafif squat.</Muted>
        <Button title="Başla" onPress={() => setI(0)} />
        <Button title="Şimdi değil, atla (başlangıç seviyesi)" kind="ghost" style={{ marginTop: 8 }} onPress={() => {
          Alert.alert('Testi atla?', 'Herkes gibi en düşük seviyeden başlarsın; ilerledikçe program güncellenir.', [{ text: 'Vazgeç' }, { text: 'Atla', onPress: () => { setResults({}); finish() } }])
        }} />
      </Screen>
    )
  }

  const val = results[t.id]
  const loads = ex ? availableLoads(profile, ex) : null
  const canNext = val !== undefined && (t.kind !== 'weighted' || (weights[t.id] ?? 0) > 0)

  return (
    <Screen padBottom={40}>
      <Muted>Test {i + 1} / {tests.length}</Muted>
      <H1>{t.title}</H1>
      {ex && (
        <Card>
          <Row style={{ marginBottom: 8 }}>
            <Image source={{ uri: imgUrl(ex, 0) }} style={{ width: '49%', aspectRatio: 1, borderRadius: 10, backgroundColor: '#fff' }} />
            <Image source={{ uri: imgUrl(ex, 1) }} style={{ width: '49%', aspectRatio: 1, borderRadius: 10, backgroundColor: '#fff' }} />
          </Row>
          <Text style={{ color: C.accent, fontWeight: '700', marginBottom: 6 }}>{ex.name}</Text>
          {ex.steps.map((s, k) => <P key={k} style={{ marginBottom: 4 }}>{k + 1}. {s}</P>)}
          <Button small kind="ghost" title="Hareketi detaylı gör" style={{ marginTop: 8 }} onPress={() => router.push(`/exercise/${ex.id}`)} />
        </Card>
      )}
      <Card>
        <P muted style={{ marginBottom: 10 }}>{t.desc}</P>
        {t.id === 'push' && (
          <View style={{ marginBottom: 12 }}>
            <Muted style={{ marginBottom: 6 }}>Hangi şınav?</Muted>
            <Wrap>
              {[['pushup', 'Normal'], ['knee_pushup', 'Dizde'], ['incline_pushup', 'Yüksekte']].map(([id, l]) => <Chip key={id} label={l} on={(variants.push ?? 'pushup') === id} onPress={() => setVariants({ ...variants, push: id })} />)}
            </Wrap>
          </View>
        )}
        {t.kind === 'weighted' && (
          <View style={{ marginBottom: 8 }}>
            <Muted style={{ marginBottom: 6 }}>Kullandığın ağırlık ({ex?.load === 'dumbbell' ? 'tek dambıl' : ex?.load === 'barbell' ? 'bar dahil toplam' : 'kg'})</Muted>
            {loads ? <Wrap>{loads.slice(0, 14).map((w) => <Chip key={w} label={`${w} kg`} on={weights[t.id] === w} onPress={() => setWeights({ ...weights, [t.id]: w })} />)}</Wrap>
              : <NumberInput value={weights[t.id]} onChange={(v) => setWeights({ ...weights, [t.id]: v ?? 0 })} suffix="kg" />}
          </View>
        )}
        {t.kind === 'timed60' && (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: timer === 0 ? C.accent2 : C.text, fontSize: 56, fontWeight: '800' }}>{timer === null ? '60' : timer}</Text>
            <Button small kind="secondary" title={timer === null ? 'Sayacı başlat' : timer === 0 ? 'Bitti' : 'Durdur'} onPress={() => (timer === null ? startTimer(60) : stopTimer())} />
          </View>
        )}
        {t.kind === 'hold' && (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: C.text, fontSize: 56, fontWeight: '800' }}>{timer ?? 0}<Text style={{ fontSize: 20, color: C.muted }}> sn</Text></Text>
            <Button small kind="secondary" title={timer === null ? 'Kronometreyi başlat' : 'Durdur ve kaydet'} onPress={() => {
              if (timer === null) startTimer(0, true)
              else { const v = stopTimer(); if (v !== null) setResults({ ...results, [t.id]: v }) }
            }} />
          </View>
        )}
        <NumberInput label={t.kind === 'hold' ? 'Saniye (elle de girebilirsin)' : 'Kaç tekrar yaptın?'} value={val} onChange={(v) => setResults({ ...results, [t.id]: v ?? 0 })} step={1} />
      </Card>
      <Row>
        {i > 0 && <Button title="Geri" kind="ghost" onPress={() => setI(i - 1)} style={{ flex: 1 }} />}
        <Button title={i === tests.length - 1 ? 'Bitir' : 'Sonraki'} disabled={!canNext} onPress={() => { stopTimer(); i === tests.length - 1 ? finish() : setI(i + 1) }} style={{ flex: 2 }} />
      </Row>
    </Screen>
  )
}
