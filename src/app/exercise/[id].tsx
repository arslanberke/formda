import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { Figure } from '../../components/Figure'
import { Button, Card, H1, H2, Muted, P, Screen } from '../../components/ui'
import { EQUIPMENT, EXERCISE_MAP, PATTERN_NAMES } from '../../data/exercises'
import { hasMove } from '../../data/moves'
import { C, F } from '../../lib/theme'

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const ex = EXERCISE_MAP[id ?? '']
  if (!ex) return <Screen><P>Hareket bulunamadı.</P></Screen>
  return (
    <Screen padBottom={40}>
      <H1>{ex.name}</H1>
      <Muted style={{ marginBottom: 12 }}>{PATTERN_NAMES[ex.pattern]} · {ex.muscles}</Muted>
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Figure id={ex.id} size={hasMove(ex.id) ? 340 : 300} glow />
      </View>
      {!hasMove(ex.id) ? <Muted style={{ textAlign: 'center', marginBottom: 12 }}>Başlangıç ↔ bitiş pozisyonu otomatik değişiyor</Muted> : null}
      <Card>
        <H2>Nasıl yapılır</H2>
        {ex.steps.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ color: C.accent, fontFamily: F.display, width: 26 }}>{i + 1}</Text>
            <P style={{ flex: 1 }}>{s}</P>
          </View>
        ))}
      </Card>
      <Card>
        <H2>Dikkat</H2>
        {ex.tips.map((s, i) => <P key={i} style={{ marginBottom: 6 }}>• {s}</P>)}
      </Card>
      <Card>
        <H2>Ekipman</H2>
        <P>{ex.equipment.map((e) => EQUIPMENT.find((q) => q.id === e)?.name ?? e).join(' veya ')}</P>
        <Muted style={{ marginTop: 6 }}>Önerilen tekrar aralığı: {ex.repRange[0]}–{ex.repRange[1]}{ex.unit === 'sec' ? ' sn' : ''}{ex.perSide ? ' (her taraf)' : ''}</Muted>
      </Card>
      <Button title="Kapat" kind="secondary" onPress={() => router.back()} />
    </Screen>
  )
}
