import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { AppState } from 'react-native'

// Yeni sürüm varsa indirip hemen uygula: açılışta ve uygulamaya geri dönünce (iki kere aç-kapa gerekmesin).
let running = false
async function applyLatest() {
  if (__DEV__ || !Updates.isEnabled || running) return
  running = true
  try {
    const c = await Updates.checkForUpdateAsync()
    if (!c.isAvailable) return
    const f = await Updates.fetchUpdateAsync()
    if (f.isNew) await Updates.reloadAsync()
  } catch {
    // ağ yoksa sessizce geç, eldeki sürümle devam
  } finally {
    running = false
  }
}

export function useOtaUpdates() {
  useEffect(() => {
    applyLatest()
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') applyLatest() })
    return () => sub.remove()
  }, [])
}
