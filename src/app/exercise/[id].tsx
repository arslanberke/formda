import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { Figure } from '../../components/Figure'
import { Button, Card, H1, TopBar, H2, Muted, P, Screen } from '../../components/ui'
import { EQUIPMENT, EXERCISE_MAP, PATTERN_NAMES } from '../../data/exercises'
import { hasMove } from '../../data/moves'
import { alternatives } from '../../lib/program'
import { excludeExercise, includeExercise, useStore } from '../../lib/store'
import { C, F } from '../../lib/theme'

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const ex = EXERCISE_MAP[id ?? '']
  const profile = useStore((s) => s.profile)
  if (!ex) return <Screen><P>Hareket bulunamadı.</P></Screen>
  return (
    <Screen padBottom={40}>
      <TopBar right={{ label: 'Kapat', onPress: () => router.back() }} />
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
        <P>{ex.equipment.map((e) => EQUIPMENT.find((q) => q.id === e)?.name ?? e).join(' + ') || 'Ekipman gerekmez'}</P>
        <Muted style={{ marginTop: 6 }}>Önerilen tekrar aralığı: {ex.repRange[0]}–{ex.repRange[1]}{ex.unit === 'sec' ? ' sn' : ''}{ex.perSide ? ' (her taraf)' : ''}</Muted>
      </Card>
 {profile && ex.pattern !== 'cardio' && alternatives(profile, ex.id).length > 0 && (
        <Card>
          <H2>Elindekilerle benzer hareketler</H2>
          {alternatives(profile, ex.id).slice(0, 8).map((a) => (
            <Pressable key={a.id} onPress={() => router.replace(`/exercise/${a.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}>
              <Figure id={a.id} size={44} />
              <Text style={{ color: C.text, fontFamily: F.medium, fontSize: 14, flex: 1 }}>{a.name}</Text>
              <Text style={{ color: a.tier < ex.tier ? C.muted : a.tier > ex.tier ? C.warn : C.accent, fontFamily: F.body, fontSize: 12 }}>{a.tier < ex.tier ? 'daha kolay' : a.tier > ex.tier ? 'daha zor' : 'benzer'}</Text>
            </Pressable>
          ))}
        </Card>
      )}
      {profile ? (profile.excluded?.includes(ex.id)
        ? <Button title="Tekrar önerilsin" kind="secondary" onPress={() => includeExercise(ex.id)} />
        : <Button title="Bu hareketi istemiyorum" kind="ghost" onPress={() => Alert.alert(`${ex.name} çıkarılsın mı?`, 'Programında varsa yerine aynı bölge için başka bir hareket gelir ve bir daha önerilmez. Ben sekmesinden geri açabilirsin.', [{ text: 'Vazgeç' }, { text: 'Çıkar', style: 'destructive', onPress: () => { excludeExercise(ex.id); router.back() } }])} />
      ) : null}
    </Screen>
  )
}
