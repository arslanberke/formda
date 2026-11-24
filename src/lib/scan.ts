import { Platform } from 'react-native'
import { parseOff, type OffProduct } from '../data/foods'
import { parseLabel, type LabelValues } from './label'

// Kamera ve yazı okuma native modül; eski kurulumda ya da web'de yoksa buton hiç çıkmaz.
type Cam = typeof import('expo-camera')
type Ocr = typeof import('expo-text-extractor')
export let cam: Cam | null = null
let ocr: Ocr | null = null
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cam = require('expo-camera')
  } catch { cam = null }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const m: Ocr = require('expo-text-extractor')
    if (m.isSupported) ocr = m
  } catch { ocr = null }
}

export const scanAvailable = () => cam != null
export const ocrAvailable = () => cam != null && ocr != null

export async function lookupBarcode(code: string): Promise<OffProduct | null> {
  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=code,product_name,product_name_tr,brands,nutriments,serving_quantity`, { headers: { 'User-Agent': 'Formda/1.0 (iOS)' } })
  if (!r.ok) return null
  const j = await r.json()
  return j.status === 1 && j.product ? parseOff(j.product) : null
}

export async function readLabel(uri: string): Promise<LabelValues> {
  if (!ocr) return {}
  return parseLabel(await ocr.extractTextFromImage(uri))
}
