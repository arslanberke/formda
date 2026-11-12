import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { C } from '../../lib/theme'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0f1528', borderTopColor: C.border },
      tabBarActiveTintColor: C.accent,
      tabBarInactiveTintColor: C.muted,
      sceneStyle: { backgroundColor: C.bg },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Bugün', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color as string} /> }} />
      <Tabs.Screen name="antrenman" options={{ title: 'Antrenman', tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color as string} /> }} />
      <Tabs.Screen name="beslenme" options={{ title: 'Beslenme', tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color as string} /> }} />
      <Tabs.Screen name="vucut" options={{ title: 'Vücut', tabBarIcon: ({ color, size }) => <Ionicons name="body" size={size} color={color as string} /> }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color as string} /> }} />
    </Tabs>
  )
}
