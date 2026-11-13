import React, { useEffect, useState } from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const ACircle = Animated.createAnimatedComponent(Circle)

export function CountUp({ to, style, duration = 900, decimals = 0 }: { to: number; style?: StyleProp<TextStyle>; duration?: number; decimals?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = Date.now()
    const tick = () => {
      const k = Math.min(1, (Date.now() - t0) / duration)
      setV(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <Text style={style}>{v.toFixed(decimals)}</Text>
}

export function Ring({ size, stroke, value, max, color, track = 'rgba(255,255,255,0.07)', delay = 150, children }: { size: number; stroke: number; value: number; max: number; color: string; track?: string; delay?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const len = 2 * Math.PI * r
  const p = useSharedValue(0)
  const target = max > 0 ? Math.min(1, value / max) : 0
  useEffect(() => {
    p.value = withDelay(delay, withTiming(target, { duration: 1100, easing: Easing.out(Easing.cubic) }))
  }, [target, delay, p])
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - p.value) }))
  return (
    <Animated.View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <ACircle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${len} ${len}`} animatedProps={props} />
      </Svg>
      {children}
    </Animated.View>
  )
}
