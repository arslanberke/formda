import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { Button, Card, H1, H2, Muted, P, Screen } from '../../components/ui'
import { EQUIPMENT, EXERCISE_MAP, PATTERN_NAMES, imgUrl } from '../../data/exercises'
import { C } from '../../lib/theme'

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const ex = EXERCISE_MAP[id ?? '']
  const [frame, setFrame] = useState<0 | 1>(0)
  useEffect(() => { const t = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 900); return () => clearInterval(t) }, [])
  if (!ex) return <Screen><P>Hareket bulunamadı.</P></Screen>
  return (
    <Screen padBottom={40}>
      <H1>{ex.name}</H1>
      <Muted style={{ marginBottom: 12 }}>{PATTERN_NAMES[ex.pattern]} · {ex.muscles}</Muted>
      <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 12 }}>
        <Image source={{ uri: imgUrl(ex, frame) }} style={{ width: '100%', aspectRatio: 1 }} resizeMode="contain" />
      </View>
      <Muted style={{ textAlign: 'center', marginBottom: 12 }}>Başlangıç ↔ bitiş pozisyonu otomatik değişiyor</Muted>
      <Card>
        <H2>Nasıl yapılır</H2>
        {ex.steps.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text style={{ color: C.accent, fontWeight: '800', width: 24 }}>{i + 1}</Text>
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
