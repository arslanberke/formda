import * as DocumentPicker from 'expo-document-picker'
import { File, Paths } from 'expo-file-system'
import { router } from 'expo-router'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CountUp } from '../../components/motion'
import { Button, Card, H2, Muted, P, Row, Screen } from '../../components/ui'
import { EQUIPMENT } from '../../data/exercises'
import { age, targets, tdee } from '../../lib/nutrition'
import { exportJson, replaceState, resetState, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'
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
      <Animated.View entering={FadeInDown.delay(60).springify().damping(16)}>
        <Text style={pf.kicker}>{age(profile)} YAŞ · {profile.heightCm} CM · {weightKg} KG · {GOALS[profile.goal].toLocaleUpperCase('tr')}</Text>
        <Text style={pf.name}>{profile.name}</Text>
        <Text style={[pf.kicker, { marginTop: 20 }]}>GÜNLÜK HEDEF</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <CountUp to={tg.kcal} style={pf.big} />
          <Text style={pf.bigUnit}>kcal</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 16 }}>
          {([['Harcadığın', `${Math.round(tdee(profile, weightKg))}`, 'kcal/gün'], ['Antrenman', `${workouts}`, 'tamamlandı'], ['Su', (tg.waterMl / 1000).toFixed(1), 'L / gün']] as const).map(([l, val, u]) => (
            <View key={l} style={pf.stat}>
              <Text style={pf.statL}>{l.toLocaleUpperCase('tr')}</Text>
              <Text style={pf.statV}>{val}</Text>
              <Text style={pf.statL}>{u}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
      <Card>
        <Muted>Hedef makrolar: protein {tg.protein} g · karb {tg.carbs} g · yağ {tg.fat} g</Muted>
        <Text style={{ color: C.text, marginTop: 8, fontFamily: F.body, fontSize: 15, lineHeight: 21 }}>Ekipman: {profile.equipment.map((e) => EQUIPMENT.find((q) => q.id === e)?.name).filter(Boolean).join(', ')}</Text>
        {profile.dumbbells.length > 0 && <Muted>Dambıl: {profile.dumbbells.join(', ')} kg</Muted>}
        <Button title="Profili / ekipmanı düzenle" kind="secondary" style={{ marginTop: 12 }} onPress={() => router.push('/onboarding')} />
        <Button title="Kapasite testini yap / yenile" kind="secondary" style={{ marginTop: 8 }} onPress={() => router.push('/assessment')} />
        <Muted style={{ marginTop: 6 }}>Ekipman değiştirirsen Antrenman sekmesinden «Programı yenile» de.</Muted>
      </Card>

      <Card>
        <H2>Yedek</H2>
        <P muted style={{ marginBottom: 10 }}>Veriler sadece bu telefonda. Expo Go silinirse ya da telefon değişirse diye ara ara yedek al (Dosyalar / iCloud’a kaydet).</P>
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

const pf = StyleSheet.create({
  kicker: { color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 },
  name: { color: C.text, fontFamily: F.display, fontSize: 34, letterSpacing: -1.5, marginTop: 6 },
  big: { color: C.accent, fontFamily: F.displayBold, fontSize: 72, letterSpacing: -4, lineHeight: 80, marginTop: 4, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 34 },
  bigUnit: { color: C.accent, fontFamily: F.display, fontSize: 18, marginLeft: 6, marginBottom: 14, opacity: 0.8 },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, padding: 14 },
  statL: { color: C.dim, fontFamily: F.medium, fontSize: 10, letterSpacing: 1 },
  statV: { color: C.text, fontFamily: F.display, fontSize: 22, letterSpacing: -1, marginVertical: 4 },
})
