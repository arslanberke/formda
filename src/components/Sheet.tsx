import { BlurView } from 'expo-blur'
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

// Spotlight tarzı panel: ortadan, hafif aşağıdan büyüyerek açılır; arka plan buzlanır.
export function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(visible)
  const p = useSharedValue(0)
  if (visible && !mounted) setMounted(true)
  useEffect(() => {
    if (visible) {
      p.value = withSpring(1, { damping: 15, stiffness: 190, mass: 0.9 })
    } else if (mounted) {
      p.value = withTiming(0, { duration: 170, easing: Easing.in(Easing.quad) })
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [visible, mounted, p])
  const panel = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.6),
    transform: [{ translateY: (1 - p.value) * 30 }, { scale: 0.86 + 0.14 * p.value }],
  }))
  const back = useAnimatedStyle(() => ({ opacity: Math.min(1, p.value) }))
  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, back]}>
        <BlurView tint="dark" intensity={40} style={StyleSheet.absoluteFill} />
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} onPress={onClose} />
      </Animated.View>
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View style={[styles.panel, panel]}>
          <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFill} />
          <View style={styles.tint} />
          <View style={{ padding: 22 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 14 },
  panel: { borderRadius: 34, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.9)' },
  tint: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(26,29,22,0.72)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.16)', borderRadius: 34 },
})
