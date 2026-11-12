import { router } from 'expo-router'
import React from 'react'
import { Alert, Image, Text, View } from 'react-native'
import { Button, Card, H1, H2, Muted, P, Row, Screen } from '../../components/ui'
import { EXERCISE_MAP, imgUrl, PATTERN_NAMES } from '../../data/exercises'
import { describeSet, generateProgram, LEVEL_NAMES } from '../../lib/program'
import { setState, useStore } from '../../lib/store'
import { C } from '../../lib/theme'
import type { Pattern } from '../../lib/types'

export default function Antrenman() {
  const profile = useStore((s) => s.profile)!
  const program = useStore((s) => s.program)
  const assessment = useStore((s) => s.assessment)
  const workouts = useStore((s) => s.workouts)
  const progress = useStore((s) => s.progress)
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const done = workouts.filter((w) => w.finishedAt)
  const nextIdx = program ? done.length % program.days.length : 0

  if (!program || !assessment) {
    return (
      <Screen>
        <H1>Antrenman</H1>
        <Card><P>Önce kapasite testi yapalım, programın ona göre çıksın.</P><Button title="Teste başla" style={{ marginTop: 10 }} onPress={() => router.push('/assessment')} /></Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <H1>Programın</H1>
      <Muted style={{ marginBottom: 12 }}>{program.split === 'full' ? 'Tüm vücut' : 'Üst / Alt'} · haftada {profile.daysPerWeek} gün · {done.length} antrenman tamamlandı</Muted>
      {program.days.map((d, di) => (
        <Card key={di} style={di === nextIdx ? { borderWidth: 1, borderColor: C.accent } : undefined}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <H2 style={{ marginBottom: 0 }}>{d.name}</H2>
            {di === nextIdx && <Text style={{ color: C.accent, fontWeight: '700' }}>Sıradaki</Text>}
          </Row>
          {d.items.map((it, k) => {
            const ex = EXERCISE_MAP[it.exerciseId]
            const pr = progress[it.exerciseId]
            const cur = pr ? { ...it, reps: pr.reps, weightKg: pr.weightKg } : it
            return (
              <Row key={k} style={{ marginBottom: 8, alignItems: 'center' }}>
                <Image source={{ uri: imgUrl(ex, 0) }} style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff' }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: '600' }} onPress={() => router.push(`/exercise/${ex.id}`)}>{ex.name}</Text>
                  <Muted>{describeSet(cur)}</Muted>
                </View>
              </Row>
            )
          })}
          <Button title="Bu antrenmanı yap" kind={di === nextIdx ? 'primary' : 'secondary'} small style={{ marginTop: 4 }} onPress={() => router.push({ pathname: '/workout', params: { day: String(di) } })} />
        </Card>
      ))}

      <H2>Seviyelerin</H2>
      <Card>
        {(Object.keys(assessment.levels) as Pattern[]).filter((k) => k !== 'cardio').map((k) => (
          <Row key={k} style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: C.text }}>{PATTERN_NAMES[k]}</Text>
            <Text style={{ color: C.accent, fontWeight: '700' }}>{LEVEL_NAMES[assessment.levels[k] ?? 0]}</Text>
          </Row>
        ))}
        <Muted style={{ marginTop: 6 }}>Son test: {assessment.date}</Muted>
        <Row style={{ marginTop: 10 }}>
          <Button small kind="secondary" title="Testi yenile" style={{ flex: 1 }} onPress={() => router.push('/assessment')} />
          <Button small kind="ghost" title="Programı yenile" style={{ flex: 1 }} onPress={() => Alert.alert('Programı yeniden oluştur?', 'Mevcut seviyelerinle farklı hareketlerden yeni program çıkar; ilerleme kayıtların sıfırlanır.', [{ text: 'Vazgeç' }, { text: 'Oluştur', onPress: () => setState({ program: generateProgram(profile, assessment, weightKg), progress: {} }) }])} />
        </Row>
      </Card>

      {done.length > 0 && (
        <View>
          <H2>Geçmiş</H2>
          {[...done].reverse().slice(0, 20).map((w) => (
            <Card key={w.id} style={{ paddingVertical: 12 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: C.text, fontWeight: '600' }}>{w.dayName}</Text>
                <Muted>{w.date}</Muted>
              </Row>
              <Muted>{w.entries.filter((e) => e.sets.some((s) => s.done)).length} hareket · {w.entries.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0)} set{w.finishedAt && w.startedAt ? ` · ${Math.round((new Date(w.finishedAt).getTime() - new Date(w.startedAt).getTime()) / 60000)} dk` : ''}</Muted>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  )
}
