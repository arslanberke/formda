import React from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, R } from '../lib/theme'

export function Screen({ children, scroll = true, style, padBottom = 24 }: { children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle>; padBottom?: number }) {
  const insets = useSafeAreaInsets()
  if (!scroll) return <View style={[styles.screen, { paddingTop: insets.top + 8 }, style]}>{children}</View>
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[{ padding: 16, paddingTop: insets.top + 8, paddingBottom: padBottom + 16 }, style]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  )
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.85 }]}>{children}</Pressable>
  return <View style={[styles.card, style]}>{children}</View>
}

export function H1({ children, style }: { children: React.ReactNode; style?: any }) { return <Text style={[styles.h1, style]}>{children}</Text> }
export function H2({ children, style }: { children: React.ReactNode; style?: any }) { return <Text style={[styles.h2, style]}>{children}</Text> }
export function P({ children, style, muted }: { children: React.ReactNode; style?: any; muted?: boolean }) { return <Text style={[styles.p, muted && { color: C.muted, fontSize: 14 }, style]}>{children}</Text> }
export function Muted({ children, style }: { children: React.ReactNode; style?: any }) { return <Text style={[styles.muted, style]}>{children}</Text> }

export function Button({ title, onPress, kind = 'primary', disabled, style, small, loading }: { title: string; onPress?: () => void; kind?: 'primary' | 'secondary' | 'ghost' | 'danger'; disabled?: boolean; style?: StyleProp<ViewStyle>; small?: boolean; loading?: boolean }) {
  const bg = kind === 'primary' ? C.accent : kind === 'secondary' ? C.card2 : kind === 'danger' ? C.danger : 'transparent'
  const color = kind === 'primary' ? '#0b1020' : kind === 'danger' ? '#0b1020' : C.text
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [styles.btn, { backgroundColor: bg, borderWidth: kind === 'ghost' ? 1 : 0, borderColor: C.border }, small && { paddingVertical: 8, paddingHorizontal: 12 }, (disabled || loading) && { opacity: 0.4 }, pressed && { transform: [{ scale: 0.98 }] }, style]}>
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.btnText, { color }, small && { fontSize: 14 }]}>{title}</Text>}
    </Pressable>
  )
}

export function Chip({ label, on, onPress, style }: { label: string; on?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && styles.chipOn, style]}>
      <Text style={[styles.chipText, on && { color: C.accent }]}>{label}</Text>
    </Pressable>
  )
}

export function Input(props: TextInputProps & { label?: string; suffix?: string }) {
  const { label, suffix, style, ...rest } = props
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput placeholderTextColor="#64748b" style={[styles.input, style, suffix ? { flex: 1 } : null]} {...rest} />
        {suffix ? <Text style={{ color: C.muted, marginLeft: 8, width: 36 }}>{suffix}</Text> : null}
      </View>
    </View>
  )
}

export function NumberInput({ label, value, onChange, suffix, placeholder, step }: { label?: string; value: number | undefined; onChange: (v: number | undefined) => void; suffix?: string; placeholder?: string; step?: number }) {
  const [text, setText] = React.useState(value === undefined ? '' : String(value))
  const [prevValue, setPrevValue] = React.useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== undefined && parseFloat(text.replace(',', '.')) !== value) setText(String(value))
    if (value === undefined && text !== '' && !Number.isNaN(parseFloat(text))) setText('')
  }
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {step ? <Pressable onPress={() => { const v = (value ?? 0) - step; const nv = Math.max(0, Math.round(v * 100) / 100); onChange(nv); setText(String(nv)) }} style={styles.stepBtn}><Text style={styles.stepTxt}>−</Text></Pressable> : null}
        <TextInput keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor="#64748b" value={text} onChangeText={(t) => { setText(t); const n = parseFloat(t.replace(',', '.')); onChange(isNaN(n) ? undefined : n) }} style={[styles.input, { flex: 1, textAlign: step ? 'center' : 'left' }]} />
        {step ? <Pressable onPress={() => { const nv = Math.round(((value ?? 0) + step) * 100) / 100; onChange(nv); setText(String(nv)) }} style={styles.stepBtn}><Text style={styles.stepTxt}>+</Text></Pressable> : null}
        {suffix ? <Text style={{ color: C.muted, width: 36 }}>{suffix}</Text> : null}
      </View>
    </View>
  )
}

export function Row({ children, style, gap = 8 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>
}

export function Wrap({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>{children}</View>
}

export function Bar({ value, max, color = C.accent, height = 8 }: { value: number; max: number; color?: string; height?: number }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <View style={{ height, backgroundColor: C.card2, borderRadius: height / 2, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height, backgroundColor: pct >= 100 ? C.accent2 : color, borderRadius: height / 2 }} />
    </View>
  )
}

export function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={{ color: color ?? C.text, fontSize: 22, fontWeight: '800', marginTop: 2 }}>{value}</Text>
      {sub ? <Text style={styles.muted}>{sub}</Text> : null}
    </View>
  )
}

export function Segment<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: C.card2, borderRadius: 12, padding: 3 }}>
      {options.map((o) => (
        <Pressable key={o.value} onPress={() => onChange(o.value)} style={{ flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: value === o.value ? C.accent : 'transparent', alignItems: 'center' }}>
          <Text style={{ color: value === o.value ? '#0b1020' : C.text, fontWeight: '600', fontSize: 13 }}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

export function Divider() { return <View style={{ height: 1, backgroundColor: C.border, marginVertical: 12 }} /> }

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  card: { backgroundColor: C.card, borderRadius: R, padding: 16, marginBottom: 12 },
  h1: { color: C.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  h2: { color: C.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  p: { color: C.text, fontSize: 16, lineHeight: 22 },
  muted: { color: C.muted, fontSize: 13 },
  btn: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: C.card2 },
  chipOn: { borderColor: C.accent, backgroundColor: 'rgba(34,211,238,0.12)' },
  chipText: { color: C.text, fontSize: 14, fontWeight: '600' },
  label: { color: C.muted, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 16 },
  stepBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  stepTxt: { color: C.text, fontSize: 22, fontWeight: '700', lineHeight: 26 },
})
