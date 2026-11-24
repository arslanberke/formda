import { router } from 'expo-router'
import React from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Button, Card, H1, H2, Muted, P, Row, Screen } from '../../components/ui'
import { Figure } from '../../components/Figure'
import { EXERCISE_MAP, PATTERN_NAMES } from '../../data/exercises'
import { healthAvailable } from '../../lib/health'
import { describeSet, generateProgram, LEVEL_NAMES } from '../../lib/program'
import { CARDIO_KINDS, pace } from '../../lib/cardio'
import { addDays, setState, todayStr, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'
import type { Pattern } from '../../lib/types'

export default function Antrenman() {
  const profile = useStore((s) => s.profile)!
  const program = useStore((s) => s.program)
  const assessment = useStore((s) => s.assessment)
  const workouts = useStore((s) => s.workouts)
  const progress = useStore((s) => s.progress)
  const weightKg = useStore((s) => s.body[s.body.length - 1]?.weightKg ?? 75)
  const cardio = useStore((s) => s.cardio)
  const done = workouts.filter((w) => w.finishedAt)
  const weekAgo = addDays(todayStr(), -6)
  const weekCardio = cardio.filter((c) => c.date >= weekAgo)
  const weekKm = Math.round(weekCardio.reduce((a, c) => a + (c.km ?? 0), 0) * 10) / 10
  const weekMin = weekCardio.reduce((a, c) => a + c.minutes, 0)
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
      <Text style={{ color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4 }}>{program.split === 'full' ? 'TÜM VÜCUT' : 'ÜST / ALT'} · HAFTADA {profile.daysPerWeek} GÜN</Text>
      <Text style={{ color: C.text, fontFamily: F.display, fontSize: 30, letterSpacing: -1.4, marginTop: 6 }}>Programın</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
        <Text style={{ color: C.accent, fontFamily: F.displayBold, fontSize: 64, letterSpacing: -4, lineHeight: 72, textShadowColor: 'rgba(217,255,61,0.25)', textShadowRadius: 30 }}>{done.length}</Text>
        <Text style={{ color: C.muted, fontFamily: F.body, fontSize: 14, marginLeft: 8, marginBottom: 14 }}>antrenman tamamlandı</Text>
      </View>
      {program.days.map((d, di) => (
        <Card key={di} style={di === nextIdx ? { borderWidth: 1, borderColor: C.accent } : undefined}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <H2 style={{ marginBottom: 0 }}>{d.name}</H2>
            {di === nextIdx && <Text style={{ color: C.accent, fontFamily: F.medium }}>Sıradaki</Text>}
          </Row>
          {d.items.map((it, k) => {
            const ex = EXERCISE_MAP[it.exerciseId]
            const pr = progress[it.exerciseId]
            const cur = pr ? { ...it, reps: pr.reps, weightKg: pr.weightKg } : it
            return (
              <Row key={k} style={{ marginBottom: 8, alignItems: 'center' }}>
                <Figure id={ex.id} size={52} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 15 }} onPress={() => router.push(`/exercise/${ex.id}`)}>{ex.name}</Text>
                  <Muted>{describeSet(cur)}</Muted>
                </View>
              </Row>
            )
          })}
          <Button title="Bu antrenmanı yap" kind={di === nextIdx ? 'primary' : 'secondary'} small style={{ marginTop: 4 }} onPress={() => router.push({ pathname: '/workout', params: { day: String(di) } })} />
        </Card>
      ))}

      <Row style={{ marginBottom: 6 }}>
        <Pressable onPress={() => router.push('/hareketler')} style={({ pressed }) => [{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 22, backgroundColor: C.card, borderWidth: 1, borderColor: C.border }, pressed && { opacity: 0.7 }]}>
          <Ionicons name="grid-outline" size={18} color={C.accent} />
          <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 14 }}>Tüm hareketler</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/kardiyo-ekle')} style={({ pressed }) => [{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 22, backgroundColor: C.card, borderWidth: 1, borderColor: C.border }, pressed && { opacity: 0.7 }]}>
          <Ionicons name="watch-outline" size={18} color={C.accent} />
          <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 14 }}>Koşu ekle</Text>
        </Pressable>
      </Row>

      <H2>Koşu & kardiyo</H2>
      <Card>
        <Row style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: C.accent, fontFamily: F.displayBold, fontSize: 40, letterSpacing: -2 }}>{weekKm || weekMin}</Text>
          <Text style={{ color: C.muted, fontFamily: F.body, fontSize: 13, marginBottom: 8 }}>{weekKm ? 'km' : 'dk'} bu hafta · {weekCardio.length} seans{weekKm ? ` · ${weekMin} dk` : ''}</Text>
        </Row>
        {cardio.length === 0 && <Muted style={{ marginTop: 4 }}>{healthAvailable() ? 'Apple Watch koşularını almak için Ana ekrandaki «Bugün harcanan» kartına dokun, «Apple Sağlık’tan al»a bas. Saatsiz yaptığını «Koşu ekle»den gir.' : 'Apple Watch’la koştuğunda süre/mesafeyi «Koşu ekle»den gir; haftalık toplamın burada birikir.'}</Muted>}
        {[...cardio].reverse().slice(0, 6).map((c) => {
          const k = CARDIO_KINDS.find((x) => x.value === c.kind)
          return (
            <Pressable key={c.id} onLongPress={() => Alert.alert('Kaydı sil?', '', [{ text: 'Vazgeç' }, { text: 'Sil', style: 'destructive', onPress: () => setState((s) => ({ cardio: s.cardio.filter((x) => x.id !== c.id) })) }])} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.border, marginTop: 6 }}>
              <Text style={{ fontSize: 18, width: 30 }}>{k?.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 14 }}>{k?.label} · {c.minutes} dk{c.km ? ` · ${c.km} km` : ''}</Text>
                <Muted>{c.date}{pace(c) ? ` · ${pace(c)}` : ''}{c.avgHr ? ` · ${c.avgHr} bpm` : ''}{c.kcal ? ` · ${c.kcal} kcal` : ''}</Muted>
              </View>
            </Pressable>
          )
        })}
      </Card>

      <H2>Seviyelerin</H2>
      <Card>
        {(Object.keys(assessment.levels) as Pattern[]).filter((k) => k !== 'cardio').map((k) => (
          <Row key={k} style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: C.text, fontFamily: F.body, fontSize: 15, flex: 1 }}>{PATTERN_NAMES[k]}</Text>
            <View style={{ flexDirection: 'row', gap: 3, marginRight: 10 }}>
              {[0, 1, 2, 3].map((n) => <View key={n} style={{ width: 16, height: 6, borderRadius: 3, backgroundColor: n <= (assessment.levels[k] ?? 0) ? C.accent : 'rgba(255,255,255,0.08)' }} />)}
            </View>
            <Text style={{ color: C.accent, fontFamily: F.medium, fontSize: 13, width: 72, textAlign: 'right' }}>{LEVEL_NAMES[assessment.levels[k] ?? 0]}</Text>
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
                <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 15 }}>{w.dayName}</Text>
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
