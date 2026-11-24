import * as Updates from 'expo-updates'

// scripts/publish.sh her yayında bir artırır.
export const RELEASE = 2

const pad = (n: number) => String(n).padStart(2, '0')

export function versionLabel() {
  const d = !Updates.isEmbeddedLaunch ? Updates.createdAt : null
  const when = d ? ` · ${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}` : ''
  return `Formda v1.${RELEASE}${when}`
}
