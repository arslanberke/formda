import * as DocumentPicker from 'expo-document-picker'
import { File, Paths } from 'expo-file-system'
import { router } from 'expo-router'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, Text } from 'react-native'
import { Button, Card, Divider, H1, H2, Muted, P, Row, Screen, Stat } from '../../components/ui'
import { EQUIPMENT } from '../../data/exercises'
import { age, targets, tdee } from '../../lib/nutrition'
import { exportJson, replaceState, resetState, useStore } from '../../lib/store'
import { C } from '../../lib/theme'
import type { AppState } from '../../lib/types'

const GOALS = { lose: 'Kilo vermek', maintain: 'Formda kalmak', gain: 'Kas yapmak' }

export default function Profil() {
  const profile = useStore((s) => s.profile)!
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const workouts = useStore((s) => s.workouts.filter((w) => w.finishedAt).length)
  const tg = targets(profile, weightKg)

  const doExport = async () => {
    try {
      const f = new File(Paths.cache, `formda-yedek-${new Date().toISOString().slice(0, 10)}.json`)
      f.write(exportJson())
      await Sharing.shareAsync(f.uri, { mimeType: 'application/json', dialogTitle: 'Formda yedeği' })
    } catch (e: any) { Alert.alert('Yedek alınamadı', String(e?.message ?? e)) }
  }
  const doImport = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'public.json', '*/*'], copyToCacheDirectory: true })
      if (r.canceled || !r.assets?.[0]) return
      const txt = await new File(r.assets[0].uri).text()
      const data = JSON.parse(txt) as Partial<AppState>
      if (data.version !== 1 || !('profile' in data)) throw new Error('Bu bir Formda yedeği değil')
      Alert.alert('Yedeği yükle?', 'Şu anki tüm veriler yedektekiyle değiştirilecek.', [{ text: 'Vazgeç' }, { text: 'Yükle', style: 'destructive', onPress: () => { replaceState(data); router.replace('/') } }])
    } catch (e: any) { Alert.alert('Yüklenemedi', String(e?.message ?? e)) }
  }
  const doReset = () => Alert.alert('Her şeyi sil?', 'Profil, program, antrenman ve beslenme kayıtların silinir. Geri alınamaz.', [{ text: 'Vazgeç' }, { text: 'Sil', style: 'destructive', onPress: async () => { await resetState(); router.replace('/onboarding') } }])

  return (
    <Screen>
      <H1>{profile.name}</H1>
      <Muted style={{ marginBottom: 12 }}>{age(profile)} yaş · {profile.heightCm} cm · {weightKg} kg · {GOALS[profile.goal]}</Muted>
      <Card>
        <Row>
          <Stat label="Günlük hedef" value={`${tg.kcal}`} sub="kcal" color={C.accent} />
          <Stat label="Harcadığın" value={`${Math.round(tdee(profile, weightKg))}`} sub="kcal/gün (tahmini)" />
          <Stat label="Antrenman" value={`${workouts}`} sub="tamamlandı" color={C.accent2} />
        </Row>
        <Divider />
        <Muted>Hedef makrolar: protein {tg.protein} g · karb {tg.carbs} g · yağ {tg.fat} g · su {(tg.waterMl / 1000).toFixed(1)} L</Muted>
        <Text style={{ color: C.text, marginTop: 8 }}>Ekipman: {profile.equipment.map((e) => EQUIPMENT.find((q) => q.id === e)?.name).filter(Boolean).join(', ')}</Text>
        {profile.dumbbells.length > 0 && <Muted>Dambıl: {profile.dumbbells.join(', ')} kg</Muted>}
        <Button title="Profili / ekipmanı düzenle" kind="secondary" style={{ marginTop: 12 }} onPress={() => router.push('/onboarding')} />
        <Muted style={{ marginTop: 6 }}>Ekipman değiştirirsen Antrenman sekmesinden "Programı yenile" de.</Muted>
      </Card>

      <Card>
        <H2>Yedek</H2>
        <P muted style={{ marginBottom: 10 }}>Veriler sadece bu telefonda. Expo Go silinirse ya da telefon değişirse diye ara ara yedek al (Dosyalar / iCloud'a kaydet).</P>
        <Row>
          <Button title="Yedek al" style={{ flex: 1 }} onPress={doExport} />
          <Button title="Yedeği yükle" kind="secondary" style={{ flex: 1 }} onPress={doImport} />
        </Row>
      </Card>

      <Card>
        <H2>Tehlikeli bölge</H2>
        <Button title="Tüm verileri sil" kind="danger" onPress={doReset} />
      </Card>
      <Muted style={{ textAlign: 'center' }}>Formda v1.0</Muted>
    </Screen>
  )
}
