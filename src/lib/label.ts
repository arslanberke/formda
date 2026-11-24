// Paket arkasındaki besin tablosunun OCR metninden 100 g/ml değerlerini çıkarır.
// Türk etiketleri: "Enerji (kJ/kcal) 183 / 43", "Yağ (g) 0,3", "Karbonhidrat (g) 4,9", "Protein (g) 5,2".
export interface LabelValues { kcal?: number; p?: number; c?: number; f?: number }

const num = (s: string) => parseFloat(s.replace(',', '.'))
const NUM = /(\d+(?:[.,]\d+)?)/

function low(s: string) {
  return s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
}

// Etiketin olduğu satırdaki (yoksa sonraki satırdaki) ilk sayı = 100 g sütunu
function valueAfter(lines: string[], match: (l: string) => boolean): number | undefined {
  for (let i = 0; i < lines.length; i++) {
    if (!match(lines[i])) continue
    const rest = lines[i].replace(/\([^)]*\)/g, ' ')
    const m = rest.match(NUM) ?? lines[i + 1]?.match(NUM)
    if (m) return num(m[1])
  }
  return undefined
}

function energy(text: string): number | undefined {
  const t = low(text).replace(/\s+/g, ' ')
  const pair = t.match(/(\d+(?:[.,]\d+)?)\s*(?:kj)?\s*\/\s*(\d+(?:[.,]\d+)?)\s*(?:kcal)?/)
  if (/kj\s*\/\s*kcal/.test(t) && pair) return num(pair[2])
  const k = t.match(/(\d+(?:[.,]\d+)?)\s*kcal/)
  if (k) return num(k[1])
  const kj = t.match(/(\d+(?:[.,]\d+)?)\s*kj/)
  if (kj) return Math.round(num(kj[1]) / 4.184)
  return undefined
}

export function parseLabel(raw: string[]): LabelValues {
  const lines = raw.flatMap((x) => x.split('\n')).map((x) => x.trim()).filter(Boolean)
  const L = lines.map(low)
  const has = (re: RegExp) => (l: string) => re.test(l)
  const fat = (l: string) => /\b(yag|fat)\b/.test(l) && !/doymus|saturat|trans|asit|tekli|coklu/.test(l)
  const carb = (l: string) => /karbonhidrat|carbohydrate/.test(l)
  const out: LabelValues = {
    kcal: energy(lines.join('\n')),
    f: valueAfter(L, fat),
    c: valueAfter(L, carb),
    p: valueAfter(L, has(/\bprotein\b/)),
  }
  return out
}
