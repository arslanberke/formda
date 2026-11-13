import { Geist_300Light, Geist_400Regular, Geist_500Medium, Geist_600SemiBold } from '@expo-google-fonts/geist'
import { Unbounded_500Medium, Unbounded_800ExtraBold } from '@expo-google-fonts/unbounded'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { hydrate, useHydrated } from '../lib/store'
import { C } from '../lib/theme'

export default function RootLayout() {
  const hydrated = useHydrated()
  const [fontsLoaded, fontError] = useFonts({ Geist_300Light, Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Unbounded_500Medium, Unbounded_800ExtraBold })
  const ready = hydrated && (fontsLoaded || !!fontError)
  useEffect(() => { hydrate() }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {!ready ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}><ActivityIndicator color={C.accent} /></View>
        ) : (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="assessment" />
            <Stack.Screen name="workout" options={{ gestureEnabled: false }} />
            <Stack.Screen name="exercise/[id]" options={{ presentation: 'modal', contentStyle: { backgroundColor: C.solid } }} />
            <Stack.Screen name="yemek-ekle" options={{ presentation: 'modal', contentStyle: { backgroundColor: C.solid } }} />
          </Stack>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
