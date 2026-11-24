import { router } from 'expo-router'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Card, Chip, H1, Muted, NumberInput, Row, Screen, Wrap } from '../components/ui'
import { CARDIO_KINDS, estimateKcal } from '../lib/cardio'
import { setState, todayStr, uid, useStore } from '../lib/store'
import { C, F } from '../lib/theme'
import type { CardioKind } from '../lib/types'

export default function CardioAdd() {
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const hasTreadmill = useStore((s) => s.profile?.equipment.includes('treadmill') ?? false)
  const [kind, setKind] = useState<CardioKind>(hasTreadmill ? 'treadmill_run' : 'outdoor_run')
  const [minutes, setMinutes] = useState<number | undefined>(30)
  const [km, setKm] = useState<number | undefined>()
  const [hr, setHr] = useState<number | undefined>()
  const [kcal, setKcal] = useState<number | undefined>()
  const [incline, setIncline] = useState<number | undefined>()
  const [daysAgo, setDaysAgo] = useState(0)
  const treadmill = kind === 'treadmill_run' || kind === 'treadmill_walk'
  const est = minutes ? estimateKcal({ kind, minutes, km, inclinePct: incline }, weightKg) : 0

  const save = () => {
    if (!minutes) return
    const d = new Date(); d.setDate(d.getDate() - daysAgo)
    setState((s) => ({ cardio: [...s.cardio, { id: uid(), date: todayStr(d), kind, minutes, km, avgHr: hr, kcal: kcal ?? est, inclinePct: treadmill ? incline : undefined }] }))
    router.back()
  }

  return (
    <Screen padBottom={40}>
      <H1>Koşu / kardiyo ekle</H1>
      <Muted style={{ marginBottom: 14 }}>Apple Watch&apos;la yaptığın koşuyu buraya gir: antrenmanı saatinde bitirince iPhone&apos;da Fitness uygulaması → Antrenmanlar&apos;da süre, mesafe, ortalama nabız ve aktif kalori yazar.</Muted>
      <Wrap>
        {CARDIO_KINDS.map((k) => <Chip key={k.value} label={`${k.icon}  ${k.label}`} on={kind === k.value} onPress={() => setKind(k.value)} />)}
      </Wrap>
      <Row style={{ marginTop: 14 }}>
        <Chip label="Bugün" on={daysAgo === 0} onPress={() => setDaysAgo(0)} />
        <Chip label="Dün" on={daysAgo === 1} onPress={() => setDaysAgo(1)} />
        <Chip label="2 gün önce" on={daysAgo === 2} onPress={() => setDaysAgo(2)} />
      </Row>
      <Card style={{ marginTop: 14 }}>
        <Row>
          <View style={{ flex: 1 }}><NumberInput label="Süre" suffix="dk" value={minutes} onChange={setMinutes} /></View>
          <View style={{ flex: 1 }}><NumberInput label="Mesafe" suffix="km" value={km} onChange={setKm} step={0.1} placeholder="ops." /></View>
        </Row>
        <Row>
          <View style={{ flex: 1 }}><NumberInput label="Ort. nabız" suffix="bpm" value={hr} onChange={setHr} placeholder="ops." /></View>
          <View style={{ flex: 1 }}><NumberInput label="Aktif kalori" suffix="kcal" value={kcal} onChange={setKcal} placeholder={est ? `~${est}` : 'ops.'} /></View>
        </Row>
        {treadmill && <NumberInput label="Eğim (ortalama)" suffix="%" value={incline} onChange={setIncline} placeholder="0" />}
        {!kcal && est > 0 && <Text style={{ color: C.muted, fontFamily: F.body, fontSize: 13, marginTop: 4 }}>Kalori girmezsen yaklaşık <Text style={{ color: C.accent }}>{est} kcal</Text> sayacağım.</Text>}
      </Card>
      {treadmill && <Muted style={{ marginBottom: 12 }}>İpucu: Bantta saat mesafeyi kolundan tahmin eder ve biraz şaşabilir. Bitince saatin sorarsa bandın ekranındaki mesafeyi gir, saat zamanla kalibre olur.</Muted>}
      <Row>
        <Button kind="secondary" title="Vazgeç" style={{ flex: 1 }} onPress={() => router.back()} />
        <Button title="Kaydet" style={{ flex: 2 }} disabled={!minutes} onPress={save} />
      </Row>
    </Screen>
  )
}
