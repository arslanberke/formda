import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { EXERCISE_MAP, imgUrl } from '../data/exercises'
import { MOVES } from '../data/moves'
import { C } from '../lib/theme'

export function Figure({ id, size, style, glow }: { id: string; size: number; style?: StyleProp<ViewStyle>; glow?: boolean }) {
  const move = MOVES[id]
  const ex = EXERCISE_MAP[id]
  const [frame, setFrame] = useState<0 | 1>(0)
  useEffect(() => {
    if (move || size < 120) return
    const t = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 900)
    return () => clearInterval(t)
  }, [move, size])
  if (move) {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        {glow ? <View style={{ position: 'absolute', width: size * 0.8, height: size * 0.8, borderRadius: size, backgroundColor: 'rgba(217,255,61,0.035)', boxShadow: `0 0 ${Math.round(size / 4)}px ${Math.round(size / 6)}px rgba(217,255,61,0.10)` }} /> : null}
        <Image source={move} style={{ width: size, height: size }} contentFit="contain" useAppleWebpCodec={false} autoplay />
      </View>
    )
  }
  if (!ex) return null
  return (
    <View style={[{ width: size, height: size, borderRadius: Math.min(28, size / 4), overflow: 'hidden', backgroundColor: '#eceee6', borderWidth: 1, borderColor: C.border }, style]}>
      <Image source={{ uri: imgUrl(ex, frame) }} style={{ width: '100%', height: '100%' }} contentFit="contain" transition={250} />
    </View>
  )
}
