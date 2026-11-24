// 100 g (ya da ml) başına değerler. portion: yaygın porsiyon (g) ve adı.
// density: g/ml, kaşık/bardak ölçüsünü grama çevirmek için (yoksa 1, yani su gibi)
export interface Food { name: string; kcal: number; p: number; c: number; f: number; portion?: [number, string]; tags?: string; density?: number }

// Pratik ölçüler (Türk mutfağı, hacim): su bardağı 200 ml, çay bardağı 100 ml, yemek kaşığı 15 ml, tatlı kaşığı 5 ml, çay kaşığı 2.5 ml
export const MEASURES: [string, number][] = [['yemek kaşığı', 15], ['tatlı kaşığı', 5], ['çay kaşığı', 2.5], ['su bardağı', 200], ['çay bardağı', 100]]

export const FOODS: Food[] = [
  // Ekmek & tahıl
  { name: 'Beyaz ekmek', kcal: 265, p: 9, c: 49, f: 3, portion: [25, '1 dilim'] },
  { name: 'Tam buğday ekmeği', kcal: 247, p: 13, c: 41, f: 3.4, portion: [25, '1 dilim'] },
  { name: 'Simit', kcal: 290, p: 10, c: 55, f: 4, portion: [110, '1 adet'] },
  { name: 'Lavaş', kcal: 275, p: 9, c: 55, f: 1.5, portion: [60, '1 adet'] },
  { name: 'Pirinç pilavı', kcal: 170, p: 3, c: 30, f: 4, portion: [150, '1 porsiyon'] },
  { name: 'Bulgur pilavı', kcal: 130, p: 4, c: 24, f: 2.5, portion: [150, '1 porsiyon'] },
  { name: 'Makarna (haşlanmış)', kcal: 157, p: 5.8, c: 31, f: 0.9, portion: [200, '1 porsiyon'] },
  { name: 'Yulaf ezmesi (kuru)', kcal: 375, p: 13, c: 60, f: 7, portion: [40, '4 yemek kaşığı'], density: 0.4 },
  { name: 'Patates (haşlanmış)', kcal: 87, p: 1.9, c: 20, f: 0.1, portion: [150, '1 orta boy'] },
  { name: 'Patates kızartması', kcal: 312, p: 3.4, c: 41, f: 15, portion: [150, '1 porsiyon'] },
  { name: 'Mısır gevreği', kcal: 380, p: 7, c: 84, f: 1, portion: [30, '1 kase'], density: 0.15 },
  // Et, tavuk, balık, yumurta
  { name: 'Tavuk göğsü (ızgara)', kcal: 165, p: 31, c: 0, f: 3.6, portion: [150, '1 porsiyon'] },
  { name: 'Tavuk but (derisiz)', kcal: 185, p: 26, c: 0, f: 8.5, portion: [120, '1 adet'] },
  { name: 'Dana kıyma (orta yağlı, pişmiş)', kcal: 250, p: 26, c: 0, f: 16, portion: [100, '1 porsiyon'] },
  { name: 'Dana bonfile', kcal: 190, p: 28, c: 0, f: 8, portion: [150, '1 porsiyon'] },
  { name: 'Köfte (ızgara)', kcal: 240, p: 18, c: 6, f: 16, portion: [30, '1 adet'] },
  { name: 'Döner (et)', kcal: 230, p: 20, c: 2, f: 16, portion: [100, '1 porsiyon'] },
  { name: 'Tavuk döner', kcal: 180, p: 22, c: 2, f: 9, portion: [100, '1 porsiyon'] },
  { name: 'Hindi füme', kcal: 105, p: 19, c: 2, f: 2, portion: [30, '2 dilim'] },
  { name: 'Sucuk', kcal: 450, p: 20, c: 2, f: 40, portion: [30, '5 dilim'] },
  { name: 'Somon (ızgara)', kcal: 208, p: 20, c: 0, f: 13, portion: [150, '1 porsiyon'] },
  { name: 'Levrek (ızgara)', kcal: 125, p: 24, c: 0, f: 2.5, portion: [200, '1 adet'] },
  { name: 'Ton balığı (konserve, suda)', kcal: 116, p: 26, c: 0, f: 1, portion: [80, '1 küçük kutu'] },
  { name: 'Hamsi (tava)', kcal: 210, p: 20, c: 5, f: 12, portion: [150, '1 porsiyon'] },
  { name: 'Yumurta (haşlanmış)', kcal: 155, p: 13, c: 1.1, f: 11, portion: [50, '1 adet'] },
  { name: 'Menemen', kcal: 120, p: 6, c: 5, f: 8, portion: [250, '1 porsiyon'] },
  { name: 'Omlet (2 yumurta)', kcal: 160, p: 11, c: 1, f: 12, portion: [120, '1 porsiyon'] },
  // Süt ürünleri
  { name: 'Pınar Protein Süt (sade, laktozsuz)', kcal: 43, p: 5.2, c: 4.9, f: 0.3, portion: [500, '1 şişe (500 ml)'], tags: 'pinar protein sut' },
  { name: 'Pınar Protein Pro+ Vanilya', kcal: 48, p: 5.2, c: 6.1, f: 0.3, portion: [500, '1 şişe (500 ml)'], tags: 'pinar protein sut' },
  { name: 'Süt (yarım yağlı)', kcal: 47, p: 3.3, c: 4.8, f: 1.6, portion: [200, '1 bardak'] },
  { name: 'Süt (tam yağlı)', kcal: 61, p: 3.2, c: 4.7, f: 3.3, portion: [200, '1 bardak'] },
  { name: 'Yoğurt (tam yağlı)', kcal: 61, p: 3.5, c: 4.7, f: 3.3, portion: [200, '1 kase'] },
  { name: 'Yoğurt (yağsız)', kcal: 40, p: 4, c: 5, f: 0.2, portion: [200, '1 kase'] },
  { name: 'Süzme yoğurt', kcal: 97, p: 9, c: 4, f: 5, portion: [150, '1 kase'], density: 1.1 },
  { name: 'Ayran', kcal: 36, p: 1.7, c: 2.6, f: 1.8, portion: [250, '1 bardak'] },
  { name: 'Kefir', kcal: 55, p: 3.3, c: 4.5, f: 2.5, portion: [200, '1 bardak'] },
  { name: 'Beyaz peynir (tam yağlı)', kcal: 265, p: 17, c: 1, f: 21, portion: [30, '1 dilim'] },
  { name: 'Beyaz peynir (yarım yağlı)', kcal: 185, p: 18, c: 2, f: 12, portion: [30, '1 dilim'] },
  { name: 'Kaşar peyniri', kcal: 350, p: 25, c: 1, f: 27, portion: [20, '1 dilim'] },
  { name: 'Lor peyniri', kcal: 100, p: 12, c: 3, f: 4, portion: [50, '2 yemek kaşığı'], density: 0.7 },
  { name: 'Tereyağı', kcal: 717, p: 0.9, c: 0.1, f: 81, portion: [10, '1 tatlı kaşığı'], density: 0.95 },
  // Bakliyat & sebze yemekleri
  { name: 'Mercimek çorbası', kcal: 60, p: 3.5, c: 9, f: 1.2, portion: [250, '1 kase'] },
  { name: 'Ezogelin çorbası', kcal: 65, p: 3, c: 10, f: 1.5, portion: [250, '1 kase'] },
  { name: 'Tarhana çorbası', kcal: 55, p: 2, c: 9, f: 1.2, portion: [250, '1 kase'] },
  { name: 'Kuru fasulye', kcal: 115, p: 6, c: 16, f: 3.5, portion: [250, '1 porsiyon'] },
  { name: 'Nohut yemeği', kcal: 125, p: 6, c: 17, f: 4, portion: [250, '1 porsiyon'] },
  { name: 'Yeşil mercimek yemeği', kcal: 105, p: 7, c: 15, f: 2.5, portion: [250, '1 porsiyon'] },
  { name: 'Kuru fasulye (haşlanmış, sade)', kcal: 127, p: 8.7, c: 23, f: 0.5, portion: [150, '1 porsiyon'] },
  { name: 'Taze fasulye (zeytinyağlı)', kcal: 70, p: 2, c: 7, f: 4, portion: [200, '1 porsiyon'] },
  { name: 'Karnıyarık', kcal: 130, p: 5, c: 8, f: 9, portion: [200, '1 adet'] },
  { name: 'Yaprak sarma (zeytinyağlı)', kcal: 160, p: 3, c: 20, f: 8, portion: [120, '6 adet'] },
  { name: 'Etli sebze yemeği', kcal: 95, p: 7, c: 6, f: 5, portion: [250, '1 porsiyon'] },
  { name: 'Ispanak yemeği', kcal: 55, p: 3, c: 5, f: 3, portion: [200, '1 porsiyon'] },
  { name: 'Sebze çorbası', kcal: 40, p: 1.5, c: 6, f: 1.2, portion: [250, '1 kase'] },
  // Hamur işi & fast food
  { name: 'Pide (kıymalı)', kcal: 260, p: 11, c: 33, f: 9, portion: [250, '1 adet'] },
  { name: 'Lahmacun', kcal: 215, p: 10, c: 30, f: 6, portion: [130, '1 adet'] },
  { name: 'Pizza', kcal: 266, p: 11, c: 33, f: 10, portion: [110, '1 dilim'] },
  { name: 'Hamburger', kcal: 250, p: 13, c: 25, f: 11, portion: [220, '1 adet'] },
  { name: 'Tavuk dürüm', kcal: 200, p: 12, c: 22, f: 7, portion: [250, '1 adet'] },
  { name: 'Et dürüm', kcal: 230, p: 13, c: 20, f: 11, portion: [250, '1 adet'] },
  { name: 'Mantı', kcal: 170, p: 8, c: 22, f: 6, portion: [300, '1 porsiyon (yoğurtlu)'] },
  { name: 'Börek (peynirli)', kcal: 290, p: 9, c: 30, f: 15, portion: [120, '1 dilim'] },
  { name: 'Poğaça', kcal: 330, p: 8, c: 38, f: 16, portion: [80, '1 adet'] },
  { name: 'Açma', kcal: 320, p: 8, c: 50, f: 10, portion: [90, '1 adet'] },
  { name: 'Gözleme', kcal: 230, p: 7, c: 32, f: 8, portion: [180, '1 adet'] },
  { name: 'Çiğ köfte', kcal: 160, p: 5, c: 30, f: 2.5, portion: [150, '1 dürüm içi'] },
  { name: 'Tost (kaşarlı)', kcal: 280, p: 12, c: 32, f: 12, portion: [130, '1 adet'] },
  { name: 'Kumpir', kcal: 150, p: 4, c: 20, f: 6, portion: [400, '1 adet'] },
  // Meyve & sebze
  { name: 'Muz', kcal: 89, p: 1.1, c: 23, f: 0.3, portion: [120, '1 adet'] },
  { name: 'Elma', kcal: 52, p: 0.3, c: 14, f: 0.2, portion: [180, '1 adet'] },
  { name: 'Portakal', kcal: 47, p: 0.9, c: 12, f: 0.1, portion: [180, '1 adet'] },
  { name: 'Mandalina', kcal: 53, p: 0.8, c: 13, f: 0.3, portion: [80, '1 adet'] },
  { name: 'Üzüm', kcal: 69, p: 0.7, c: 18, f: 0.2, portion: [100, '1 salkım'] },
  { name: 'Karpuz', kcal: 30, p: 0.6, c: 8, f: 0.2, portion: [300, '1 dilim'] },
  { name: 'Çilek', kcal: 32, p: 0.7, c: 8, f: 0.3, portion: [150, '1 kase'] },
  { name: 'Armut', kcal: 57, p: 0.4, c: 15, f: 0.1, portion: [180, '1 adet'] },
  { name: 'Kuru kayısı', kcal: 241, p: 3.4, c: 63, f: 0.5, portion: [30, '4 adet'] },
  { name: 'Hurma', kcal: 277, p: 1.8, c: 75, f: 0.2, portion: [25, '3 adet'] },
  { name: 'Domates', kcal: 18, p: 0.9, c: 3.9, f: 0.2, portion: [120, '1 adet'] },
  { name: 'Salatalık', kcal: 15, p: 0.7, c: 3.6, f: 0.1, portion: [150, '1 adet'] },
  { name: 'Çoban salata', kcal: 60, p: 1.5, c: 6, f: 3.5, portion: [200, '1 porsiyon'] },
  { name: 'Yeşil salata (sade)', kcal: 20, p: 1.5, c: 3, f: 0.3, portion: [150, '1 porsiyon'] },
  { name: 'Brokoli (haşlanmış)', kcal: 35, p: 2.4, c: 7, f: 0.4, portion: [150, '1 porsiyon'] },
  { name: 'Havuç', kcal: 41, p: 0.9, c: 10, f: 0.2, portion: [80, '1 adet'] },
  { name: 'Avokado', kcal: 160, p: 2, c: 9, f: 15, portion: [100, 'yarım adet'] },
  // Kuruyemiş & yağlar
  { name: 'Badem', kcal: 579, p: 21, c: 22, f: 50, portion: [30, '1 avuç'] },
  { name: 'Ceviz', kcal: 654, p: 15, c: 14, f: 65, portion: [30, '1 avuç'] },
  { name: 'Fındık', kcal: 628, p: 15, c: 17, f: 61, portion: [30, '1 avuç'] },
  { name: 'Yer fıstığı (kavrulmuş)', kcal: 585, p: 24, c: 21, f: 50, portion: [30, '1 avuç'] },
  { name: 'Kaju', kcal: 553, p: 18, c: 30, f: 44, portion: [30, '1 avuç'] },
  { name: 'Leblebi', kcal: 370, p: 20, c: 58, f: 6, portion: [30, '1 avuç'] },
  { name: 'Ay çekirdeği (iç)', kcal: 584, p: 21, c: 20, f: 51, portion: [30, '1 avuç'] },
  { name: 'Fıstık ezmesi', kcal: 588, p: 25, c: 20, f: 50, portion: [20, '1 yemek kaşığı'], density: 1.07 },
  { name: 'Zeytin', kcal: 115, p: 0.8, c: 6, f: 11, portion: [20, '5 adet'] },
  { name: 'Zeytinyağı', kcal: 884, p: 0, c: 0, f: 100, portion: [10, '1 yemek kaşığı'], density: 0.92 },
  { name: 'Bal', kcal: 304, p: 0.3, c: 82, f: 0, portion: [20, '1 yemek kaşığı'], density: 1.42 },
  { name: 'Reçel', kcal: 250, p: 0.3, c: 62, f: 0.1, portion: [20, '1 yemek kaşığı'], density: 1.3 },
  { name: 'Tahin-pekmez', kcal: 450, p: 10, c: 50, f: 25, portion: [40, '2 yemek kaşığı'], density: 1.2 },
  // Tatlı & atıştırmalık
  { name: 'Baklava', kcal: 430, p: 7, c: 50, f: 23, portion: [40, '1 dilim'] },
  { name: 'Sütlaç', kcal: 130, p: 3.5, c: 22, f: 3, portion: [200, '1 kase'] },
  { name: 'Çikolata (sütlü)', kcal: 535, p: 7.6, c: 59, f: 30, portion: [30, '1 küçük paket'] },
  { name: 'Bitter çikolata (%70+)', kcal: 598, p: 7.8, c: 46, f: 43, portion: [6, '1 kare'] },
  { name: 'Bisküvi', kcal: 480, p: 6, c: 68, f: 20, portion: [10, '1 adet'] },
  { name: 'Cips', kcal: 536, p: 7, c: 53, f: 34, portion: [40, '1 küçük paket'] },
  { name: 'Dondurma', kcal: 207, p: 3.5, c: 24, f: 11, portion: [100, '2 top'] },
  { name: 'Kurabiye', kcal: 490, p: 6, c: 62, f: 24, portion: [25, '1 adet'] },
  { name: 'Protein tozu (whey)', kcal: 400, p: 78, c: 8, f: 6, portion: [30, '1 ölçek'], density: 0.45 },
  { name: 'Protein bar', kcal: 380, p: 32, c: 35, f: 12, portion: [60, '1 adet'] },
  // İçecekler
  { name: 'Çay (şekersiz)', kcal: 1, p: 0, c: 0.2, f: 0, portion: [200, '1 bardak'] },
  { name: 'Çay (1 şekerli)', kcal: 10, p: 0, c: 2.5, f: 0, portion: [200, '1 bardak'] },
  { name: 'Türk kahvesi (sade)', kcal: 2, p: 0, c: 0.4, f: 0, portion: [60, '1 fincan'] },
  { name: 'Latte', kcal: 50, p: 2.6, c: 4, f: 2.5, portion: [300, '1 orta boy'] },
  { name: 'Kola', kcal: 42, p: 0, c: 10.6, f: 0, portion: [330, '1 kutu'] },
  { name: 'Kola (zero)', kcal: 0.3, p: 0, c: 0, f: 0, portion: [330, '1 kutu'] },
  { name: 'Meyve suyu', kcal: 45, p: 0.3, c: 11, f: 0.1, portion: [200, '1 bardak'] },
  { name: 'Portakal suyu (taze)', kcal: 45, p: 0.7, c: 10, f: 0.2, portion: [250, '1 bardak'] },
  { name: 'Bira', kcal: 43, p: 0.5, c: 3.6, f: 0, portion: [500, '1 büyük'] },
  { name: 'Şalgam', kcal: 15, p: 0.5, c: 3, f: 0, portion: [300, '1 bardak'] },
  { name: 'Enerji içeceği', kcal: 45, p: 0, c: 11, f: 0, portion: [250, '1 kutu'] },
  { name: 'Yumurta (çiğ, pişirmeden önce)', kcal: 143, p: 12.6, c: 0.7, f: 9.5, portion: [50, '1 adet'] },
  { name: 'Chia tohumu', kcal: 486, p: 16.5, c: 42, f: 30.7, portion: [12, '1 yemek kaşığı'], density: 0.8 },
  { name: 'Kakao (şekersiz)', kcal: 228, p: 19.6, c: 58, f: 13.7, portion: [5, '1 tatlı kaşığı'], density: 0.5 },
  { name: 'Yaban mersini', kcal: 57, p: 0.7, c: 14.5, f: 0.3, portion: [70, '1 avuç'] },
  { name: 'Marul', kcal: 17, p: 1.2, c: 3.3, f: 0.3, portion: [50, '3 yaprak'] },
  { name: 'Yeşil biber', kcal: 20, p: 0.9, c: 4.6, f: 0.2, portion: [30, '1 adet'] },
  { name: 'Mısır (konserve)', kcal: 80, p: 2.6, c: 17, f: 1.2, portion: [30, '2 yemek kaşığı'], density: 0.75 },
]

// Yiyeceğin türüne göre pratik ölçüler (g). Kaynak: TÜBER 2015 porsiyonları (1 avuç fındık 30 g, 2 ince dilim ekmek 50 g),
// Hacettepe Yemek ve Besin Fotoğraf Kataloğu; 100 g tablet çikolata genelde 16-24 kare.
const UNIT_RULES: [RegExp, [string, number][]][] = [
  [/ezmesi|tahin|pekmez|recel|\bbal\b|yagi?\b|tozu/, []],
  [/cikolata|gofret/, [['kare', 6], ['sıra (4 kare)', 24], ['tablet (80 g)', 80]]],
  [/findik|badem|ceviz|fistik|kaju|leblebi|cekirdek|cerez|kuruyemis|kuru uzum|antep/, [['avuç', 30], ['tane', 1.2]]],
  [/ekmek|lavas|tost/, [['ince dilim', 20], ['dilim', 25], ['kalın dilim', 35]]],
  [/peynir|kasar/, [['dilim', 30], ['kibrit kutusu kadar', 30]]],
  [/biskuvi|kraker/, [['adet', 8], ['paket (küçük)', 40]]],
  [/cips|patlamis/, [['avuç', 15], ['küçük paket', 40]]],
  [/zeytin\b|zeytin$/, [['tane', 4]]],
  [/yumurta/, [['adet', 50]]],
  [/pilav|makarna|bulgur|kuskus|eriste/, [['servis kaşığı', 30], ['kase', 180]]],
  [/yogurt|corba|sut|ayran|kefir|smoothie/, [['kase', 200], ['bardak', 200]]],
]
export const GENERIC_UNITS: [string, number][] = [['avuç', 30], ['kase', 200]]

export function unitsFor(f: Food): [string, number][] {
  const n = normalizeTr(`${f.name} ${f.tags ?? ''}`)
  const rule = UNIT_RULES.find(([re]) => re.test(n))
  return rule ? rule[1] : GENERIC_UNITS
}

// Smoothie, salata, tost gibi karışık yiyecekler: tek ürün yerine içindekilerden hesaplanır.
// [yiyecek adı, ölçü ('g' | 'ml' | 'portion' | kaşık/dilim…), varsayılan miktar]
export type MixItem = [string, string, number]
export interface Mix { name: string; re: RegExp; items: MixItem[] }
export const MIXES: Mix[] = [
  { name: 'Smoothie', re: /smoothie|shake|milkshake|smuti/, items: [
    ['Süt (yarım yağlı)', 'ml', 200], ['Muz', 'portion', 1], ['Yulaf ezmesi (kuru)', 'yemek kaşığı', 2], ['Fıstık ezmesi', 'portion', 1],
    ['Protein tozu (whey)', 'portion', 1], ['Pınar Protein Süt (sade, laktozsuz)', 'ml', 200], ['Kefir', 'ml', 200], ['Yoğurt (tam yağlı)', 'g', 100],
    ['Çilek', 'g', 100], ['Yaban mersini', 'portion', 1], ['Hurma', 'g', 25], ['Bal', 'tatlı kaşığı', 1], ['Kakao (şekersiz)', 'portion', 1],
    ['Chia tohumu', 'portion', 1], ['Ceviz', 'g', 15], ['Avokado', 'g', 50] ] },
  { name: 'Yulaf kasesi', re: /yulaf|overnight|granola|musli|porridge/, items: [
    ['Yulaf ezmesi (kuru)', 'yemek kaşığı', 4], ['Süt (yarım yağlı)', 'ml', 150], ['Yoğurt (tam yağlı)', 'g', 100], ['Muz', 'portion', 1],
    ['Bal', 'tatlı kaşığı', 1], ['Fıstık ezmesi', 'portion', 1], ['Ceviz', 'g', 15], ['Chia tohumu', 'portion', 1], ['Çilek', 'g', 100],
    ['Protein tozu (whey)', 'portion', 1], ['Kakao (şekersiz)', 'portion', 1] ] },
  { name: 'Salata', re: /salata/, items: [
    ['Domates', 'portion', 1], ['Salatalık', 'portion', 1], ['Marul', 'portion', 1], ['Yeşil biber', 'portion', 1], ['Zeytinyağı', 'portion', 1],
    ['Beyaz peynir (tam yağlı)', 'portion', 1], ['Ton balığı (konserve, suda)', 'portion', 1], ['Tavuk göğsü (ızgara)', 'g', 100],
    ['Mısır (konserve)', 'portion', 1], ['Zeytin', 'tane', 5], ['Avokado', 'g', 50], ['Yumurta (haşlanmış)', 'portion', 1], ['Lor peyniri', 'g', 50] ] },
  { name: 'Tost / sandviç', re: /tost|sandvic|sandwich/, items: [
    ['Beyaz ekmek', 'dilim', 2], ['Tam buğday ekmeği', 'dilim', 2], ['Kaşar peyniri', 'portion', 2], ['Beyaz peynir (tam yağlı)', 'portion', 1],
    ['Sucuk', 'g', 30], ['Hindi füme', 'g', 30], ['Domates', 'g', 40], ['Tereyağı', 'portion', 1], ['Lavaş', 'portion', 1] ] },
  { name: 'Omlet / menemen', re: /omlet|menemen|sahanda|cilbir/, items: [
    ['Yumurta (çiğ, pişirmeden önce)', 'portion', 2], ['Tereyağı', 'portion', 1], ['Zeytinyağı', 'portion', 1], ['Domates', 'portion', 1],
    ['Yeşil biber', 'portion', 1], ['Kaşar peyniri', 'portion', 1], ['Beyaz peynir (tam yağlı)', 'portion', 1], ['Sucuk', 'g', 30] ] },
]

export const mixFor = (q: string) => { const n = normalizeTr(q.trim()); return n.length < 3 ? undefined : MIXES.find((m) => m.re.test(n)) }
export const foodByName = (name: string) => FOODS.find((f) => f.name === name)

// Bir ölçünün (g, ml, porsiyon, kaşık, dilim…) bu yiyecekte kaç grama denk geldiği
export function unitGramsOf(f: Food, u: string): number {
  if (u === 'g') return 1
  if (u === 'ml') return f.density ?? 1
  const portionLabel = f.portion?.[1].replace(/^1 /, '')
  if (u === 'portion' || u === portionLabel) return f.portion?.[0] ?? 100
  const ex = unitsFor(f).find(([l]) => l === u)
  if (ex) return ex[1]
  return (MEASURES.find((m) => m[0] === u)?.[1] ?? 1) * (f.density ?? 1)
}
export const unitLabelOf = (f: Food, u: string) => (u === 'portion' ? (f.portion?.[1].replace(/^1 /, '') ?? 'porsiyon') : u)

export function normalizeTr(s: string) {
  return s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
}

export function searchFoods(q: string, extra: Food[] = []): Food[] {
  const n = normalizeTr(q.trim())
  if (!n) return []
  const all = [...extra, ...FOODS]
  const words = n.split(/\s+/)
  const hay = (f: Food) => normalizeTr(`${f.name} ${f.tags ?? ''}`)
  const starts = all.filter((f) => normalizeTr(f.name).startsWith(n))
  const incl = all.filter((f) => !starts.includes(f) && words.every((w) => hay(f).includes(w)))
  return [...starts, ...incl].slice(0, 25)
}

export interface OffProduct { name: string; brand?: string; kcal: number; p: number; c: number; f: number; serving?: number }

export function parseOff(pr: any): OffProduct | null {
  const n = pr.nutriments ?? {}
  const kcal = n['energy-kcal_100g'] ?? (n['energy_100g'] ? n['energy_100g'] / 4.184 : undefined)
  const name = pr.product_name_tr || pr.product_name
  if (!name || kcal === undefined) return null
  const brand = Array.isArray(pr.brands) ? pr.brands.map((b: string) => b.replace(/^xx:/, '')).join(', ') : pr.brands
  return { name, brand, kcal: Math.round(kcal), p: +(n.proteins_100g ?? 0), c: +(n.carbohydrates_100g ?? 0), f: +(n.fat_100g ?? 0), serving: pr.serving_quantity ? +pr.serving_quantity : undefined }
}

const FIELDS = 'code,product_name,product_name_tr,brands,nutriments,serving_quantity'

// Open Food Facts'in yeni arama servisi (search-a-licious). Türkçe harfli yazım bazen eşleşmiyor
// ("pınar" ≠ "pinar"), o yüzden iki yazımla da arayıp birleştiriyoruz. Eski search.pl sık sık 503 veriyor.
export async function searchOpenFoodFacts(q: string): Promise<OffProduct[]> {
  const variants = [...new Set([q.trim(), normalizeTr(q.trim())])]
  const hits = await Promise.all(variants.map(async (v) => {
    const url = `https://search.openfoodfacts.org/search?q=${encodeURIComponent(v)}&page_size=20&langs=tr,en&fields=${FIELDS}`
    const r = await fetch(url, { headers: { 'User-Agent': 'Formda/1.0 (iOS)' } })
    if (!r.ok) throw new Error('OFF ' + r.status)
    const j = await r.json()
    return (j.hits ?? []) as any[]
  }).map((p) => p.catch(() => [] as any[])))
  const seen = new Set<string>()
  const out: OffProduct[] = []
  for (const pr of hits.flat()) {
    const key = pr.code ?? `${pr.product_name}-${pr.brands}`
    if (seen.has(key)) continue
    seen.add(key)
    const x = parseOff(pr)
    if (x) out.push(x)
  }
  return out
}
