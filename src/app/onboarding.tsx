import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { Button, Card, Chip, H1, H2, Input, Muted, NumberInput, P, Row, Screen, Segment, Steps, Wrap } from '../components/ui'
import { EQUIPMENT } from '../data/exercises'
import { generateProgram } from '../lib/program'
import { setState, todayStr, useStore } from '../lib/store'
import { C, F } from '../lib/theme'
import type { Activity, EquipmentId, Goal, Profile, Sex } from '../lib/types'

const DB_PRESETS = [2, 3, 4, 5, 6, 7.5, 8, 10, 12, 12.5, 14, 15, 16, 17.5, 20, 22.5, 25, 30]
const KB_PRESETS = [4, 6, 8, 10, 12, 16, 20, 24, 28, 32]
const PLATE_PRESETS = [1.25, 2.5, 5, 10, 15, 20, 25]

export default function Onboarding() {
  const existing = useStore((s) => s.profile)
  const lastBody = useStore((s) => s.body[s.body.length - 1])
  const [step, setStep] = useState(0)
  const [name, setName] = useState(existing?.name ?? '')
  const [sex, setSex] = useState<Sex>(existing?.sex ?? 'm')
  const [birthYear, setBirthYear] = useState<number | undefined>(existing?.birthYear)
  const [heightCm, setHeightCm] = useState<number | undefined>(existing?.heightCm)
  const [weightKg, setWeightKg] = useState<number | undefined>(lastBody?.weightKg)
  const [goal, setGoal] = useState<Goal>(existing?.goal ?? 'lose')
  const [activity, setActivity] = useState<Activity>(existing?.activity ?? 'sedentary')
  const [days, setDays] = useState<2 | 3 | 4>(existing?.daysPerWeek ?? 3)
  const [eq, setEq] = useState<EquipmentId[]>(existing?.equipment ?? ['bodyweight'])
  const [dumbbells, setDumbbells] = useState<number[]>(existing?.dumbbells ?? [])
  const [kettlebells, setKettlebells] = useState<number[]>(existing?.kettlebells ?? [])
  const [plates, setPlates] = useState<number[]>(existing?.plates ?? [])
  const [barWeight, setBarWeight] = useState<number | undefined>(existing?.barWeight ?? 20)
  const [customDb, setCustomDb] = useState<number | undefined>()

  const toggleEq = (id: EquipmentId) => setEq((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]))
  const toggleNum = (list: number[], set: (v: number[]) => void, v: number) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v].sort((a, b) => a - b))

  const next = () => {
    if (step === 0) {
      if (!birthYear || birthYear < 1930 || birthYear > new Date().getFullYear() - 10) return Alert.alert('Doğum yılını kontrol et')
      if (!heightCm || heightCm < 120 || heightCm > 230) return Alert.alert('Boyunu cm olarak gir (ör. 178)')
      if (!weightKg || weightKg < 30 || weightKg > 300) return Alert.alert('Kilonu kg olarak gir (ör. 82)')
    }
    if (step === 2 && eq.includes('dumbbell') && dumbbells.length === 0) return Alert.alert('Hangi dambıl ağırlıkların var?', 'En az birini seç; ona göre ağırlık önereceğim.')
    if (step < 3) setStep(step + 1)
    else finish()
  }

  const finish = () => {
    const profile: Profile = {
      name: name.trim() || 'Sporcu', sex, birthYear: birthYear!, heightCm: heightCm!, goal, activity, daysPerWeek: days,
      equipment: eq.length ? eq : ['bodyweight'], dumbbells, kettlebells, plates, barWeight: barWeight ?? 20,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    setState((s) => {
      const today = todayStr()
      const body = s.body.filter((b) => b.date !== today)
      body.push({ date: today, weightKg: weightKg! })
      body.sort((a, b) => a.date.localeCompare(b.date))
      const program = existing && s.assessment ? generateProgram(profile, s.assessment, weightKg!) : s.program
      return { profile, body, program, progress: program === s.program ? s.progress : {} }
    })
    if (existing) router.back()
    else router.replace('/assessment')
  }

  return (
    <Screen padBottom={40}>
      <Steps n={4} i={step} label={`Adım ${step + 1} / 4`} />
      {step === 0 && (
        <View>
          <H1>Seni tanıyalım</H1>
          <P muted style={{ marginBottom: 16 }}>Kalori hedefin ve program bunlara göre hesaplanacak.</P>
          <Card>
            <Input label="Adın (isteğe bağlı)" value={name} onChangeText={setName} placeholder="Berke" />
            <Text style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>Cinsiyet</Text>
            <View style={{ marginBottom: 12 }}><Segment options={[{ value: 'm', label: 'Erkek' }, { value: 'f', label: 'Kadın' }]} value={sex} onChange={setSex} /></View>
            <NumberInput label="Doğum yılı" value={birthYear} onChange={setBirthYear} placeholder="2000" />
            <NumberInput label="Boy" value={heightCm} onChange={setHeightCm} placeholder="178" suffix="cm" />
            <NumberInput label="Kilo" value={weightKg} onChange={setWeightKg} placeholder="82" suffix="kg" />
          </Card>
        </View>
      )}
      {step === 1 && (
        <View>
          <H1>Hedefin ne?</H1>
          <Card>
            {([['lose', 'Yağ yakmak / kilo vermek', 'Günlük ~500 kcal açık, yüksek protein'], ['maintain', 'Formda kalmak', 'Kilonu koru, güçlen'], ['gain', 'Kas yapmak / kilo almak', 'Günlük ~300 kcal fazla']] as [Goal, string, string][]).map(([g, t, d]) => (
              <Card key={g} onPress={() => setGoal(g)} style={{ backgroundColor: goal === g ? 'rgba(34,211,238,0.12)' : C.card2, borderWidth: 1, borderColor: goal === g ? C.accent : C.border }}>
                <Text style={{ color: C.text, fontFamily: F.semi, fontSize: 16 }}>{t}</Text>
                <Muted>{d}</Muted>
              </Card>
            ))}
          </Card>
          <Card>
            <H2>Günlük hareketin (spor hariç)</H2>
            {([['sedentary', 'Masa başı, az yürüyorum'], ['light', 'Günde biraz yürüyorum / ayaktayım'], ['moderate', 'Hareketli iş ya da çok yürüyorum'], ['active', 'Fiziksel ağır iş']] as [Activity, string][]).map(([a, t]) => (
              <Chip key={a} label={t} on={activity === a} onPress={() => setActivity(a)} style={{ marginBottom: 8, alignSelf: 'flex-start' }} />
            ))}
          </Card>
          <Card>
            <H2>Haftada kaç gün spor?</H2>
            <Muted style={{ marginBottom: 8 }}>Yeni başlıyorsan 3 gün ideal. 2 de olur, az ama düzenli olsun.</Muted>
            <Segment options={[{ value: 2, label: '2 gün' }, { value: 3, label: '3 gün' }, { value: 4, label: '4 gün' }] as any} value={days as any} onChange={(v: any) => setDays(v)} />
          </Card>
        </View>
      )}
      {step === 2 && (
        <View>
          <H1>Neyin var?</H1>
          <P muted style={{ marginBottom: 12 }}>Sadece sende olanları seç. Hiçbir şey yoksa da program çıkar.</P>
          <Wrap>
            {EQUIPMENT.map((e) => (
              <Chip key={e.id} label={`${e.emoji} ${e.name}`} on={eq.includes(e.id)} onPress={() => toggleEq(e.id)} />
            ))}
          </Wrap>
          {eq.includes('dumbbell') && (
            <Card style={{ marginTop: 16 }}>
              <H2>Dambıl ağırlıkların (tek dambıl, kg)</H2>
              <Muted style={{ marginBottom: 8 }}>Ayarlanabilir dambılın varsa yapabildiğin tüm kademeleri seç.</Muted>
              <Wrap>{DB_PRESETS.map((w) => <Chip key={w} label={`${w}`} on={dumbbells.includes(w)} onPress={() => toggleNum(dumbbells, setDumbbells, w)} />)}</Wrap>
              <Row style={{ marginTop: 10 }}>
                <View style={{ flex: 1 }}><NumberInput value={customDb} onChange={setCustomDb} placeholder="Listede yoksa yaz" /></View>
                <Button small title="Ekle" kind="secondary" onPress={() => { if (customDb) { toggleNum(dumbbells, setDumbbells, customDb); setCustomDb(undefined) } }} />
              </Row>
              {dumbbells.length > 0 && <Muted>Seçili: {dumbbells.join(', ')} kg</Muted>}
            </Card>
          )}
          {eq.includes('kettlebell') && (
            <Card style={{ marginTop: 16 }}>
              <H2>Kettlebell ağırlıkların (kg)</H2>
              <Wrap>{KB_PRESETS.map((w) => <Chip key={w} label={`${w}`} on={kettlebells.includes(w)} onPress={() => toggleNum(kettlebells, setKettlebells, w)} />)}</Wrap>
            </Card>
          )}
          {eq.includes('barbell') && (
            <Card style={{ marginTop: 16 }}>
              <H2>Bar ve plakalar</H2>
              <NumberInput label="Barın ağırlığı" value={barWeight} onChange={setBarWeight} suffix="kg" />
              <Muted style={{ marginBottom: 8 }}>Hangi plakalardan var? (her birinden en az 2 tane varsayılır)</Muted>
              <Wrap>{PLATE_PRESETS.map((w) => <Chip key={w} label={`${w}`} on={plates.includes(w)} onPress={() => setPlates(plates.includes(w) ? plates.filter((x) => x !== w) : [...plates, w, w].sort((a, b) => a - b))} />)}</Wrap>
            </Card>
          )}
        </View>
      )}
      {step === 3 && (
        <View>
          <H1>Son adım: kapasite testi</H1>
          <Card>
            <P>Sana hazır bir program vermek yerine önce ne yapabildiğini ölçeceğiz: birkaç basit test (şınav, squat, plank ve ekipmanına göre birkaçı daha).</P>
            <P style={{ marginTop: 10 }}>Sonuçlara göre her hareket için seviyen, başlangıç tekrarın ve ağırlığın belirlenecek. Zorlandıkça ya da kolay geldikçe program kendini güncelleyecek.</P>
            <Muted style={{ marginTop: 10 }}>Test 10-15 dk sürer. Isınmış ol, rahat kıyafet giy. Hazır değilsen testi sonra da yapabilirsin.</Muted>
          </Card>
        </View>
      )}
      <Row style={{ marginTop: 16 }}>
        {step > 0 && <Button title="Geri" kind="ghost" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />}
        <Button title={step === 3 ? (existing ? 'Kaydet' : 'Teste başla') : 'Devam'} onPress={next} style={{ flex: 2 }} />
      </Row>
    </Screen>
  )
}
