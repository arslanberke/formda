import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, F } from '../../lib/theme'

export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute', marginHorizontal: 18, bottom: Math.max(insets.bottom, 12), height: 64, paddingBottom: 0, paddingTop: 0,
        borderRadius: 32, borderTopWidth: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'transparent', overflow: 'hidden', elevation: 0,
      },
      tabBarItemStyle: { height: 62, paddingTop: 8 },
      tabBarBackground: () => (
        <View style={StyleSheet.absoluteFill}>
          <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,22,18,0.72)' }]} />
        </View>
      ),
      tabBarLabelStyle: { fontFamily: F.medium, fontSize: 10.5 },
      tabBarActiveTintColor: C.accent,
      tabBarInactiveTintColor: C.dim,
      sceneStyle: { backgroundColor: C.bg },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Bugün', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={21} color={color as string} /> }} />
      <Tabs.Screen name="antrenman" options={{ title: 'Antrenman', tabBarIcon: ({ color }) => <Ionicons name="barbell-outline" size={22} color={color as string} /> }} />
      <Tabs.Screen name="beslenme" options={{ title: 'Beslenme', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={20} color={color as string} /> }} />
      <Tabs.Screen name="vucut" options={{ title: 'Vücut', tabBarIcon: ({ color }) => <Ionicons name="body-outline" size={21} color={color as string} /> }} />
      <Tabs.Screen name="profil" options={{ title: 'Ben', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color as string} /> }} />
    </Tabs>
  )
}
