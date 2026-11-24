import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Figure } from '../components/Figure'
import { Chip, H1, Muted, Screen, Wrap } from '../components/ui'
import { EQUIPMENT, EXERCISES, PATTERN_NAMES, hasEquipment } from '../data/exercises'
import { useStore } from '../lib/store'
import { C, F } from '../lib/theme'
import type { EquipmentId, Pattern } from '../lib/types'

const PATTERNS = Object.keys(PATTERN_NAMES) as Pattern[]

export default function Library() {
  const mine = useStore((s) => s.profile?.equipment ?? (['bodyweight'] as EquipmentId[]))
  const [onlyMine, setOnlyMine] = useState(true)
  const [eq, setEq] = useState<EquipmentId | null>(null)
  const [pt, setPt] = useState<Pattern | null>(null)
  const list = useMemo(() => EXERCISES.filter((e) =>
    (!onlyMine || hasEquipment(e, mine)) &&
    (!eq || e.equipment.includes(eq) || (eq === 'bodyweight' && e.equipment.length === 0)) &&
    (!pt || e.pattern === pt)
  ).sort((a, b) => PATTERNS.indexOf(a.pattern) - PATTERNS.indexOf(b.pattern) || a.tier - b.tier), [onlyMine, eq, pt, mine])

  return (
    <Screen padBottom={40}>
      <H1>Hareketler</H1>
      <Muted style={{ marginBottom: 12 }}>{list.length} hareket · elindeki ekipmanla neler yapabileceğine bak, dokununca nasıl yapıldığını gösteriyor.</Muted>
      <Wrap>
        <Chip label="Elimdekilerle" on={onlyMine} onPress={() => setOnlyMine(true)} />
        <Chip label="Tümü" on={!onlyMine} onPress={() => setOnlyMine(false)} />
      </Wrap>
      <Text style={{ color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4, marginTop: 14, marginBottom: 8 }}>EKİPMAN</Text>
      <Wrap>
        <Chip label="Hepsi" on={!eq} onPress={() => setEq(null)} />
        {EQUIPMENT.filter((q) => q.id !== 'gym' && (!onlyMine || q.id === 'bodyweight' || mine.includes(q.id) || mine.includes('gym'))).map((q) => (
          <Chip key={q.id} label={q.id === 'bodyweight' ? 'Ekipmansız' : q.name} on={eq === q.id} onPress={() => setEq(eq === q.id ? null : q.id)} />
        ))}
      </Wrap>
      <Text style={{ color: C.dim, fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4, marginTop: 14, marginBottom: 8 }}>BÖLGE</Text>
      <Wrap>
        <Chip label="Hepsi" on={!pt} onPress={() => setPt(null)} />
        {PATTERNS.map((p) => <Chip key={p} label={PATTERN_NAMES[p]} on={pt === p} onPress={() => setPt(pt === p ? null : p)} />)}
      </Wrap>
      <View style={{ marginTop: 16 }}>
        {list.map((e) => (
          <Pressable key={e.id} onPress={() => router.push(`/exercise/${e.id}`)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border }, pressed && { opacity: 0.6 }]}>
            <Figure id={e.id} size={60} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontFamily: F.semi, fontSize: 15 }}>{e.name}</Text>
              <Text style={{ color: C.muted, fontFamily: F.body, fontSize: 12, marginTop: 2 }}>{PATTERN_NAMES[e.pattern]} · {e.equipment.length ? e.equipment.map((q) => EQUIPMENT.find((x) => x.id === q)?.name ?? q).join(' + ') : 'Ekipmansız'}</Text>
            </View>
            <Text style={{ color: C.accent, fontFamily: F.medium, fontSize: 12 }}>{'●'.repeat(Math.min(5, Math.max(1, Math.ceil(e.tier / 1.4))))}</Text>
          </Pressable>
        ))}
        {list.length === 0 && <Muted>Bu filtreyle hareket yok.</Muted>}
      </View>
    </Screen>
  )
}
