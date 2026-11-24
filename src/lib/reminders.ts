import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export interface Reminders { days: number[]; hour: number; minute: number }

// expo-notifications haftalık tetikleyici: 1 = Pazar … 7 = Cumartesi
export const WEEKDAYS: { n: number; label: string }[] = [
  { n: 2, label: 'Pzt' }, { n: 3, label: 'Sal' }, { n: 4, label: 'Çar' }, { n: 5, label: 'Per' },
  { n: 6, label: 'Cum' }, { n: 7, label: 'Cmt' }, { n: 1, label: 'Paz' },
]

const LINES = ['Bugün antrenman günü. 20 dakika bile sayılır.', 'Programın hazır, sadece başla.', 'Dünkü senden biraz daha iyi ol.']

export async function applyReminders(r: Reminders | null): Promise<boolean> {
  if (Platform.OS === 'web') return false
  await Notifications.cancelAllScheduledNotificationsAsync()
  if (!r || r.days.length === 0) return true
  const perm = await Notifications.requestPermissionsAsync()
  if (!perm.granted) return false
  for (const [i, weekday] of r.days.entries()) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Formda 💪', body: LINES[i % LINES.length] },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour: r.hour, minute: r.minute },
    })
  }
  return true
}
