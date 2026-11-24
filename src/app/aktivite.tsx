import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { Button, Card, H1, Muted, NumberInput, Row, Screen, TopBar } from '../components/ui'
import { stepKcal, useEnergy } from '../lib/energy'
import { healthAvailable, importToday } from '../lib/health'
import { setState, useStore } from '../lib/store'
import { C, F } from '../lib/theme'

export default function Aktivite() {
  const { activity, today, weightKg, burn } = useEnergy()
  const profile = useStore((s) => s.profile)!
  const [steps, setSteps] = useState<number | undefined>(activity?.steps)
  const [active, setActive] = useState<number | undefined>(activity?.activeKcal)
  const [busy, setBusy] = useState(false)
  const dirty = steps !== activity?.steps || active !== activity?.activeKcal
  const cancel = () => (dirty ? Alert.alert('Kaydetmeden çık?', 'Girdiğin bilgiler silinecek.', [{ text: 'Devam et' }, { text: 'Çık', style: 'destructive', onPress: () => router.back() }]) : router.back())

  const save = () => {
    setState((s) => {
      const next = { ...(s.activity ?? {}) }
      if (steps == null && active == null) delete next[today]
      else next[today] = { steps, activeKcal: active, source: 'manual' }
      return { activity: next }
    })
    router.back()
  }
  const fromHealth = async () => {
    setBusy(true)
    try {
      const r = await importToday()
      if (r) { setSteps(r.steps); setActive(r.activeKcal) }
      else Alert.alert('Apple Sağlık verisi yok', 'İzin verdiğinden ve saatin iPhone ile eşleştiğinden emin ol.')
    } catch (e: any) { Alert.alert('Apple Sağlık açılamadı', String(e?.message ?? e)) }
    setBusy(false)
  }

  return (
    <Screen padBottom={40}>
      <TopBar left={{ label: 'Vazgeç', onPress: cancel }} />
      <H1>Bugünkü hareket</H1>
      <Muted style={{ marginBottom: 14 }}>
        En doğrusu saatin Hareket halkasındaki aktif kalori: iPhone&apos;da Fitness uygulamasını aç, kırmızı halkanın altındaki kcal sayısını yaz. Saat yoksa sadece adımı gir.
      </Muted>
      {healthAvailable() && <Button title="Apple Sağlık'tan al" kind="secondary" loading={busy} onPress={fromHealth} style={{ marginBottom: 12 }} />}
      <Card>
        <Row>
          <View style={{ flex: 1 }}><NumberInput label="Aktif kalori (saat)" suffix="kcal" value={active} onChange={setActive} placeholder="ops." /></View>
          <View style={{ flex: 1 }}><NumberInput label="Adım" value={steps} onChange={setSteps} step={500} placeholder="ops." /></View>
        </Row>
        {active == null && steps ? (
          <Text style={{ color: C.muted, fontFamily: F.body, fontSize: 13, marginTop: 4 }}>
            {steps} adım ≈ <Text style={{ color: C.accent }}>{Math.round(stepKcal(steps, profile, weightKg))} kcal</Text> (dinlenmenin üstüne)
          </Text>
        ) : null}
        {active != null ? <Muted style={{ marginTop: 4 }}>Aktif kalori girdiğinde adım ve antrenmanlar ayrıca sayılmaz, saat onları zaten içerir.</Muted> : null}
      </Card>
      {burn ? <Muted style={{ marginBottom: 12 }}>Dinlenme metabolizman (Mifflin-St Jeor) + sindirim: {Math.round(burn.rest + burn.digest)} kcal. Bunun üstüne hareket eklenir.</Muted> : null}
      <Button title="Kaydet" onPress={save} />
    </Screen>
  )
}
