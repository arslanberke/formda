// Isınma: RAMP yapısı (Jeffreys 2007) — nabzı yükselt, eklemleri hareket ettir, kasları uyandır.
// Antrenman öncesi uzun statik esneme kuvveti düşürebildiği için (Behm 2016) esneme sona konur;
// ACSM esneme önerisi: her pozisyonda 10-30 sn bekle, acıtmadan hafif gerginlik hissi.
export interface RoutineStep {
  name: string
  sec: number
  how: string
  photo?: string
  sides?: boolean
}

export const WARMUP: RoutineStep[] = [
  { name: 'Yerinde tempolu yürüyüş', sec: 45, how: 'Dizleri hafif kaldırarak yerinde yürü, kollarını salla. Nefesin biraz hızlansın.' },
  { name: 'Kol çevirme', sec: 30, how: 'Kollar yanda, küçük daireden büyüğe doğru çevir. Yarısında yön değiştir.' },
  { name: 'Kalça çevirme', sec: 30, how: 'Eller belde, kalçanı geniş daireler çizerek çevir. Yarısında yön değiştir.' },
  { name: 'Bacak sallama', sec: 40, how: 'Bir yere tutun, bacağını öne-arkaya rahatça salla. Yarısında diğer bacak.', sides: true },
  { name: 'Yavaş squat', sec: 30, how: 'Sandalyeye oturur gibi yavaşça çömel, topuklar yerde kalsın, kalkarken kalçanı sık.', photo: 'bw_squat' },
  { name: 'Kalça köprüsü', sec: 30, how: 'Sırtüstü, dizler bükülü. Kalçanı kaldır, 1 sn tut, yavaşça indir.', photo: 'glute_bridge' },
  { name: 'Jumping jack', sec: 30, how: 'Zıplayarak ayakları aç, kolları başının üstünde birleştir. Zıplayamıyorsan adım adım yap.', photo: 'jumping_jack' },
]

export const COOLDOWN: RoutineStep[] = [
  { name: 'Ön bacak esnetme', sec: 60, how: 'Ayakta bir yere tutun, ayağını arkadan kalçana doğru çek. Dizler yan yana. Yarısında diğer bacak.', sides: true },
  { name: 'Arka bacak esnetme', sec: 30, how: 'Otur, bacaklar önde düz. Sırtını düz tutarak öne uzan, ayak bileklerine ya da dizlerine tutun.' },
  { name: 'Kalça esnetme', sec: 60, how: 'Sırtüstü yat, bir ayak bileğini diğer dizinin üstüne koy, alttaki bacağı göğsüne çek. Yarısında taraf değiştir.', sides: true },
  { name: 'Göğüs esnetme', sec: 30, how: 'Kapı kenarına ön kolunu dayayıp gövdeni hafifçe öne döndür. Göğsün gerildiğini hisset.' },
  { name: 'Omuz esnetme', sec: 40, how: 'Kolunu göğsünün önünden karşıya uzat, diğer elinle dirsekten kendine çek. Yarısında diğer kol.', sides: true },
  { name: 'Çocuk pozu', sec: 30, how: 'Dizlerinin üstüne otur, kollarını öne uzatıp alnını yere bırak. Derin ve yavaş nefes al.' },
]

export const routineMinutes = (s: RoutineStep[]) => Math.round(s.reduce((a, x) => a + x.sec, 0) / 60)
