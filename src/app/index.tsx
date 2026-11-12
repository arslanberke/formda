import { Redirect } from 'expo-router'
import { useStore } from '../lib/store'

export default function Index() {
  const profile = useStore((s) => s.profile)
  const assessment = useStore((s) => s.assessment)
  if (!profile) return <Redirect href="/onboarding" />
  if (!assessment) return <Redirect href="/assessment" />
  return <Redirect href="/(tabs)" />
}
