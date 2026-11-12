import type { EquipmentId, Pattern } from '../lib/types'

export type LoadType = 'bw' | 'dumbbell' | 'barbell' | 'kettlebell' | 'band' | 'dumbbell1'

export interface Exercise {
  id: string
  name: string
  pattern: Pattern
  tier: number            // zorluk basamağı (1 en kolay)
  equipment: EquipmentId[] // hepsi gerekli (boşsa sadece vücut ağırlığı)
  load: LoadType          // ağırlık türü (bw = vücut ağırlığı)
  unit: 'reps' | 'sec'
  perSide?: boolean
  img: string             // free-exercise-db klasör adı
  muscles: string
  steps: string[]
  tips: string[]
  repRange: [number, number]
}

const IMG = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
export const imgUrl = (ex: Exercise, i: 0 | 1 = 0) => `${IMG}${ex.img}/${i}.jpg`

export const EXERCISES: Exercise[] = [
  // ---------- İTİŞ (yatay) ----------
  {
    id: 'wall_pushup', name: 'Duvar Şınavı', pattern: 'push', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Incline_Push-Up', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Duvara dönük, bir adım geride dur. Ellerini omuz hizasında, omuz genişliğinden biraz açık duvara koy.', 'Vücudunu dümdüz tutarak dirseklerini bükerek göğsünü duvara yaklaştır.', 'Duvarı iterek başlangıca dön.'],
    tips: ['Kalçanı bükme, kafandan topuğuna düz bir çizgi ol.', 'Zorlaştırmak için ayaklarını duvardan biraz daha uzağa al.'], repRange: [10, 20],
  },
  {
    id: 'incline_pushup', name: 'Yüksekte Şınav', pattern: 'push', tier: 2, equipment: [], load: 'bw', unit: 'reps', img: 'Incline_Push-Up_Medium', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Ellerini bel hizasında sağlam bir yere koy (masa, tezgah, koltuk kolu).', 'Vücudun düz, karnın sıkı. Göğsünü yüzeye doğru indir.', 'Kollarını düzelterek yukarı it.'],
    tips: ['Yüzey ne kadar alçaksa hareket o kadar zor. Her hafta biraz daha alçak bir yer seç.', 'Dirsekler 45 derece açıyla gövdeye yakın insin.'], repRange: [8, 15],
  },
  {
    id: 'knee_pushup', name: 'Dizde Şınav', pattern: 'push', tier: 3, equipment: [], load: 'bw', unit: 'reps', img: 'Pushups', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Dizlerinin üstünde, eller omuz hizasının biraz dışında yere koyulu.', 'Dizden başına kadar düz bir çizgi oluştur. Göğsünü yere yaklaştır.', 'Yeri iterek yukarı çık.'],
    tips: ['Kalçanı havaya kaldırma, gövde düz kalsın.', 'Göğsün yere 5-10 cm kalana kadar in.'], repRange: [8, 15],
  },
  {
    id: 'pushup', name: 'Şınav', pattern: 'push', tier: 4, equipment: [], load: 'bw', unit: 'reps', img: 'Pushups', muscles: 'Göğüs, omuz, arka kol, karın',
    steps: ['Plank pozisyonunda, eller omuz hizasının biraz dışında.', 'Dirsekleri bükerek göğsünü yere yaklaştır. Gövde kaskatı.', 'Yeri iterek kolları düzelt.'],
    tips: ['Bel çökmesin, kalça kalkmasın.', 'Nefesi inerken al, iterken ver.'], repRange: [6, 15],
  },
  {
    id: 'decline_pushup', name: 'Ayak Yüksekte Şınav', pattern: 'push', tier: 5, equipment: [], load: 'bw', unit: 'reps', img: 'Push-Ups_With_Feet_Elevated', muscles: 'Üst göğüs, omuz, arka kol',
    steps: ['Ayaklarını bir sandalye/basamağa koy, eller yerde omuz genişliğinde.', 'Göğsünü yere doğru indir, gövde düz.', 'Yukarı it.'],
    tips: ['Omuzlarını kulaklarından uzak tut.', 'Ayak ne kadar yüksekse o kadar zor.'], repRange: [6, 15],
  },
  {
    id: 'db_floor_press', name: 'Dambıl Yer Pres', pattern: 'push', tier: 4, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Floor_Press', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Sırt üstü yere yat, dizler bükülü, dambıllar göğüs hizasında.', 'Dambılları yukarı it, kollar düzelsin.', 'Dirsekler yere değene kadar kontrollü indir.'],
    tips: ['Dirsekler gövdeyle 45 derece açı yapsın.', 'Bench yoksa göğüs çalışmanın en güvenli yolu.'], repRange: [8, 12],
  },
  {
    id: 'db_bench_press', name: 'Dambıl Bench Pres', pattern: 'push', tier: 5, equipment: ['dumbbell', 'bench'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Bench_Press', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Bench\'e sırt üstü yat, dambıllar göğüs hizasında, avuçlar ileri bakıyor.', 'Dambılları göğsünün üstünde birleşecek şekilde yukarı it.', 'Göğüs hizasına kadar kontrollü indir.'],
    tips: ['Kürek kemiklerini sık, göğsünü yukarı çıkar.', 'Ayaklar yere sağlam bassın.'], repRange: [8, 12],
  },
  {
    id: 'bb_bench_press', name: 'Bench Pres (Bar)', pattern: 'push', tier: 6, equipment: ['barbell', 'bench'], load: 'barbell', unit: 'reps', img: 'Barbell_Bench_Press_-_Medium_Grip', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Bench\'e yat, gözlerin barın altında. Barı omuz genişliğinden biraz açık tut.', 'Barı göğsünün ortasına kontrollü indir.', 'Barı yukarı it, kollar düzelsin.'],
    tips: ['Bilekler düz, bar avuç içinde.', 'Yanında kimse yoksa güvenlik kolları kullan ya da ağırlığı düşük tut.'], repRange: [6, 10],
  },
  {
    id: 'band_chest_press', name: 'Lastikle Göğüs Pres', pattern: 'push', tier: 3, equipment: ['band'], load: 'band', unit: 'reps', img: 'Bench_Press_-_With_Bands', muscles: 'Göğüs, omuz, arka kol',
    steps: ['Lastiği sırtından geçir, uçlarını ellerinde tut.', 'Ellerini göğüs hizasından öne doğru it.', 'Kontrollü geri dön.'],
    tips: ['Gövdeni sabit tut, sadece kollar hareket etsin.'], repRange: [10, 20],
  },

  // ---------- İTİŞ (dikey / omuz) ----------
  {
    id: 'pike_pushup', name: 'Pike Şınav', pattern: 'vpush', tier: 2, equipment: [], load: 'bw', unit: 'reps', img: 'Hanging_Pike', muscles: 'Omuz, arka kol',
    steps: ['Şınav pozisyonundan kalçanı havaya kaldır, vücudun ters V olsun.', 'Dirsekleri bükerek başını ellerinin önünde yere yaklaştır.', 'Yeri iterek başlangıca dön.'],
    tips: ['Kalça ne kadar yukarıdaysa o kadar omuz çalışır.', 'Başını kesinlikle yere çarpma, yavaş in.'], repRange: [6, 12],
  },
  {
    id: 'db_shoulder_press', name: 'Dambıl Omuz Pres', pattern: 'vpush', tier: 3, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Standing_Dumbbell_Press', muscles: 'Omuz, arka kol',
    steps: ['Ayakta, dambıllar omuz hizasında, avuçlar ileri.', 'Dambılları başının üstünde birleşecek şekilde yukarı it.', 'Omuz hizasına kontrollü indir.'],
    tips: ['Belini kavis yapma, karnını sık.', 'Oturarak yaparsan belin daha korunur.'], repRange: [8, 12],
  },
  {
    id: 'band_shoulder_press', name: 'Lastikle Omuz Pres', pattern: 'vpush', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Shoulder_Press_-_With_Bands', muscles: 'Omuz, arka kol',
    steps: ['Lastiğin üstüne bas, uçlarını omuz hizasında tut.', 'Ellerini başının üstüne it.', 'Kontrollü indir.'],
    tips: ['Ayakları açarak lastiği gerersen hareket zorlaşır.'], repRange: [10, 20],
  },
  {
    id: 'bb_ohp', name: 'Omuz Pres (Bar)', pattern: 'vpush', tier: 4, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Standing_Military_Press', muscles: 'Omuz, arka kol, karın',
    steps: ['Bar köprücük kemiği hizasında, eller omuzdan biraz açık.', 'Barı başının üstüne it; bar geçerken başını hafif geri al.', 'Kontrollü indir.'],
    tips: ['Kalçanı ve karnını sık, belini kavis yapma.'], repRange: [6, 10],
  },
  {
    id: 'db_lateral_raise', name: 'Yana Açış (Dambıl)', pattern: 'vpush', tier: 1, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Side_Lateral_Raise', muscles: 'Yan omuz',
    steps: ['Ayakta, dambıllar yanda, dirsekler hafif bükülü.', 'Kollarını yanlara omuz hizasına kadar kaldır.', 'Yavaşça indir.'],
    tips: ['Hafif ağırlık kullan, sallanma.', 'Omuzlarını kulaklarına çekme.'], repRange: [10, 15],
  },

  // ---------- ÇEKİŞ ----------
  {
    id: 'towel_row', name: 'Kapı Çekişi (Havlu)', pattern: 'pull', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Inverted_Row', muscles: 'Sırt, pazı',
    steps: ['Sağlam bir kapı kolunun iki yanından bir havlu geçir, uçlarını tut (ya da kapı kollarını iki elle tut).', 'Ayakların kapıya yakın, geriye yaslan; kollar düz.', 'Kürek kemiklerini sıkarak göğsünü ellerine çek, sonra kontrollü aç.'],
    tips: ['Ayaklar ne kadar öndeyse o kadar zor.', 'Kapının sağlam ve kapalı olduğundan emin ol.'], repRange: [8, 15],
  },
  {
    id: 'inverted_row', name: 'Ters Çekiş (Masa/Bar)', pattern: 'pull', tier: 3, equipment: [], load: 'bw', unit: 'reps', img: 'Inverted_Row', muscles: 'Sırt, pazı, arka omuz',
    steps: ['Sağlam bir masanın altına gir ya da alçak bir bar kullan, kenarından tut.', 'Vücudunu düz tut, topuklar yerde.', 'Göğsünü kenara doğru çek, yavaşça in.'],
    tips: ['Vücut ne kadar yataysa o kadar zor.', 'Masanın devrilmeyeceğinden emin ol.'], repRange: [6, 12],
  },
  {
    id: 'band_row', name: 'Lastikle Kürek', pattern: 'pull', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Seated_Band_Hamstring_Curl', muscles: 'Sırt, pazı',
    steps: ['Otur, lastiği ayak tabanlarına dola, uçları elinde.', 'Dirseklerini geriye çekerek elleri karnına getir, kürek kemiklerini sık.', 'Kontrollü bırak.'],
    tips: ['Sırtın dik, omuzlar aşağıda.'], repRange: [12, 20],
  },
  {
    id: 'db_row', name: 'Tek Kol Dambıl Kürek', pattern: 'pull', tier: 3, equipment: ['dumbbell'], load: 'dumbbell1', unit: 'reps', perSide: true, img: 'One-Arm_Dumbbell_Row', muscles: 'Sırt, pazı',
    steps: ['Bir elini ve dizini bench/sandalyeye koy, sırt yere paralel.', 'Dambılı dirseğini geriye-yukarı çekerek karnına doğru kaldır.', 'Kontrollü indir. Her kol için tekrar et.'],
    tips: ['Gövdeyi döndürme, sırt düz.', 'Dirsek vücuda yakın, kürek kemiğini sık.'], repRange: [8, 12],
  },
  {
    id: 'bb_row', name: 'Bar ile Kürek', pattern: 'pull', tier: 4, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Bent_Over_Barbell_Row', muscles: 'Sırt, pazı, bel',
    steps: ['Barı tut, dizler hafif bükülü, gövdeni öne eğ (yere ~45 derece).', 'Barı karnına doğru çek, kürek kemiklerini sık.', 'Kontrollü indir.'],
    tips: ['Belin kesinlikle düz; yuvarlanırsa ağırlığı azalt.'], repRange: [6, 10],
  },
  {
    id: 'kb_row', name: 'Kettlebell Kürek', pattern: 'pull', tier: 3, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', perSide: true, img: 'One-Arm_Kettlebell_Row', muscles: 'Sırt, pazı',
    steps: ['Öne eğil, bir el dizde destek. Kettlebell diğer elde.', 'Dirseği geriye çekerek karnına kaldır.', 'Kontrollü indir.'],
    tips: ['Sırt düz, boyun nötr.'], repRange: [8, 12],
  },
  {
    id: 'dead_hang', name: 'Barda Asılı Kalma', pattern: 'pull', tier: 2, equipment: ['pullupbar'], load: 'bw', unit: 'sec', img: 'Scapular_Pull-Up', muscles: 'Kavrama, sırt, omuz',
    steps: ['Barı omuz genişliğinde tut, ayaklarını yerden kes.', 'Omuzlarını kulaklarından uzak tutarak asılı kal.', 'Süre dolunca kontrollü in.'],
    tips: ['Barfiks için ilk adım: kavrama gücü.'], repRange: [15, 45],
  },
  {
    id: 'negative_pullup', name: 'Negatif Barfiks', pattern: 'pull', tier: 4, equipment: ['pullupbar'], load: 'bw', unit: 'reps', img: 'Pullups', muscles: 'Sırt, pazı',
    steps: ['Zıplayarak ya da sandalyeyle çenen barın üstünde olacak şekilde başla.', '3-5 saniyede yavaş yavaş kollar düzelene kadar in.', 'Tekrar yukarı çık ve tekrar et.'],
    tips: ['Barfiks yapamayanlar için en etkili yol.', 'Düşer gibi inme, inişi kontrol et.'], repRange: [3, 8],
  },
  {
    id: 'band_pullup', name: 'Lastik Destekli Barfiks', pattern: 'pull', tier: 4, equipment: ['pullupbar', 'band'], load: 'bw', unit: 'reps', img: 'Band_Assisted_Pull-Up', muscles: 'Sırt, pazı',
    steps: ['Lastiği bara bağla, bir dizini/ayağını içine koy.', 'Çenen barı geçene kadar çek.', 'Kontrollü in.'],
    tips: ['Lastik kalınlaştıkça kolaylaşır; zamanla inceltin.'], repRange: [5, 10],
  },
  {
    id: 'pullup', name: 'Barfiks', pattern: 'pull', tier: 5, equipment: ['pullupbar'], load: 'bw', unit: 'reps', img: 'Pullups', muscles: 'Sırt, pazı, ön kol',
    steps: ['Barı omuzdan biraz açık tut, avuçlar ileri.', 'Kürek kemiklerini aşağı çekerek başla, çenen barı geçene kadar çek.', 'Kontrollü in, kollar tam düzelsin.'],
    tips: ['Sallanma; gövden sabit kalsın.', 'Avuçlar sana bakarsa (chin-up) biraz daha kolay olur.'], repRange: [3, 10],
  },
  {
    id: 'lat_pulldown', name: 'Lat Pulldown (Makine)', pattern: 'pull', tier: 3, equipment: ['gym'], load: 'barbell', unit: 'reps', img: 'Wide-Grip_Lat_Pulldown', muscles: 'Sırt, pazı',
    steps: ['Otur, dizlerini pedin altına sabitle, barı geniş tut.', 'Barı üst göğsüne doğru çek, dirsekler aşağı.', 'Kontrollü bırak.'],
    tips: ['Geriye yatma, hafif eğim yeter.'], repRange: [8, 12],
  },

  // ---------- SQUAT ----------
  {
    id: 'chair_squat', name: 'Sandalyeye Oturma Squat', pattern: 'squat', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Sit_Squats', muscles: 'Bacak, kalça',
    steps: ['Sandalyenin önünde dur, ayaklar omuz genişliğinde.', 'Kalçanı geriye vererek sandalyeye hafifçe dokununca kalk (tam oturma).', 'Topuklarla iterek ayağa kalk.'],
    tips: ['Dizler ayak uçlarıyla aynı yöne baksın.', 'Kolları öne uzatmak dengeyi kolaylaştırır.'], repRange: [8, 15],
  },
  {
    id: 'bw_squat', name: 'Squat (Vücut Ağırlığı)', pattern: 'squat', tier: 2, equipment: [], load: 'bw', unit: 'reps', img: 'Bodyweight_Squat', muscles: 'Bacak, kalça',
    steps: ['Ayaklar omuz genişliğinde, uçlar hafif dışa.', 'Kalçanı geriye-aşağı ver, uyluklar yere paralel olana kadar in.', 'Topuklardan iterek kalk.'],
    tips: ['Topuklar yerden kalkmasın.', 'Göğüs dik, bakış ileri.'], repRange: [10, 20],
  },
  {
    id: 'goblet_squat', name: 'Goblet Squat', pattern: 'squat', tier: 3, equipment: ['dumbbell'], load: 'dumbbell1', unit: 'reps', img: 'Goblet_Squat', muscles: 'Bacak, kalça, karın',
    steps: ['Dambılı dik tutup göğsüne yasla, dirsekler aşağıda.', 'Dirseklerin dizlerinin içine gelecek şekilde çömel.', 'Topuklardan iterek kalk.'],
    tips: ['Ağırlığın öndeki konumu dik durmanı kolaylaştırır; yeni başlayan için en iyi ağırlıklı squat.'], repRange: [8, 12],
  },
  {
    id: 'kb_goblet_squat', name: 'Kettlebell Goblet Squat', pattern: 'squat', tier: 3, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', img: 'Goblet_Squat', muscles: 'Bacak, kalça, karın',
    steps: ['Kettlebell\'i kulplarından göğüs hizasında tut.', 'Çömel, dirsekler dizlerin içinde.', 'Topuklardan iterek kalk.'],
    tips: ['Sırt düz, göğüs yukarı.'], repRange: [8, 12],
  },
  {
    id: 'db_squat', name: 'Dambıl Squat', pattern: 'squat', tier: 4, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Squat', muscles: 'Bacak, kalça',
    steps: ['İki dambıl yanlarda, ayaklar omuz genişliğinde.', 'Kalçanı geriye-aşağı ver, uyluklar paralel.', 'Topuklardan iterek kalk.'],
    tips: ['Omuzlar geride, sırt düz.'], repRange: [8, 12],
  },
  {
    id: 'bb_squat', name: 'Squat (Bar)', pattern: 'squat', tier: 5, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Barbell_Squat', muscles: 'Bacak, kalça, bel',
    steps: ['Bar üst sırtında (trapez), eller barda sıkı. Ayaklar omuz genişliğinde.', 'Nefes al, karnını sık, kalçanı geriye-aşağı ver, uyluklar paralel.', 'Topuklardan iterek kalk, üstte nefes ver.'],
    tips: ['Dizler içe çökmesin.', 'Rack/güvenlik kolu kullan.'], repRange: [5, 10],
  },
  {
    id: 'jump_squat', name: 'Zıplamalı Squat', pattern: 'squat', tier: 4, equipment: [], load: 'bw', unit: 'reps', img: 'Freehand_Jump_Squat', muscles: 'Bacak, kalça, kondisyon',
    steps: ['Squat pozisyonuna in.', 'Patlayıcı şekilde yukarı zıpla.', 'Yumuşak in, hemen tekrar çömel.'],
    tips: ['Dizlerin üstüne sert inme, parmak ucuyla yumuşak in.'], repRange: [8, 15],
  },

  // ---------- HINGE (kalça / arka bacak) ----------
  {
    id: 'glute_bridge', name: 'Kalça Köprüsü', pattern: 'hinge', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Butt_Lift_Bridge', muscles: 'Kalça, arka bacak',
    steps: ['Sırt üstü yat, dizler bükülü, ayaklar yerde kalçaya yakın.', 'Topuklara basarak kalçanı yukarı kaldır; omuzdan dize düz çizgi.', 'Üstte kalçanı 1 sn sık, kontrollü indir.'],
    tips: ['Belini kavis yapma, kalçanı sık.'], repRange: [12, 20],
  },
  {
    id: 'single_leg_bridge', name: 'Tek Bacak Köprü', pattern: 'hinge', tier: 2, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Single_Leg_Glute_Bridge', muscles: 'Kalça, arka bacak',
    steps: ['Köprü pozisyonunda bir bacağını uzat.', 'Yerdeki topuğa basarak kalçanı kaldır.', 'Kontrollü in. Diğer bacağa geç.'],
    tips: ['Kalçalar yere paralel kalsın, bir tarafa dönmesin.'], repRange: [8, 15],
  },
  {
    id: 'db_rdl', name: 'Dambıl Romen Deadlift', pattern: 'hinge', tier: 3, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Stiff-Legged_Dumbbell_Deadlift', muscles: 'Arka bacak, kalça, bel',
    steps: ['Ayakta, dambıllar uylukların önünde, dizler hafif bükülü.', 'Kalçanı geriye iterek gövdeni öne eğ; dambıllar bacaklara yakın insin.', 'Arka bacakta gerilmeyi hissedince kalçanı öne iterek kalk.'],
    tips: ['Sırt dümdüz, boyun nötr.', 'Diz bükmek değil kalça geriye itmek hareketin özü.'], repRange: [8, 12],
  },
  {
    id: 'kb_swing', name: 'Kettlebell Swing', pattern: 'hinge', tier: 3, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', img: 'One-Arm_Kettlebell_Swings', muscles: 'Kalça, arka bacak, bel, kondisyon',
    steps: ['Kettlebell önünde, iki elle tut, kalçanı geri it.', 'Kettlebell\'i bacakların arasından geçirip kalçanı öne iterek göğüs hizasına savur.', 'Kollar sadece yönlendirir; güç kalçadan gelir.'],
    tips: ['Squat değil, kalça hareketi.', 'Bel bükülmesin.'], repRange: [12, 20],
  },
  {
    id: 'kb_deadlift', name: 'Kettlebell Deadlift', pattern: 'hinge', tier: 2, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', img: 'Kettlebell_One-Legged_Deadlift', muscles: 'Kalça, arka bacak, bel',
    steps: ['Kettlebell ayaklarının arasında. Kalçanı geriye iterek eğil, kulpu tut.', 'Sırt düz; topuklara basıp kalçanı öne iterek kalk.', 'Aynı yolla indir.'],
    tips: ['Kollar sadece kanca, çekme işini bacak ve kalça yapar.'], repRange: [8, 12],
  },
  {
    id: 'bb_rdl', name: 'Romen Deadlift (Bar)', pattern: 'hinge', tier: 4, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Romanian_Deadlift', muscles: 'Arka bacak, kalça, bel',
    steps: ['Bar uylukların önünde, eller omuz genişliğinde.', 'Kalçanı geriye iterek barı bacaklara yakın indir, dizler hafif bükülü.', 'Kalçanı öne iterek kalk.'],
    tips: ['Sırt düz kalmıyorsa o kadar inme.'], repRange: [6, 10],
  },
  {
    id: 'bb_deadlift', name: 'Deadlift (Bar)', pattern: 'hinge', tier: 5, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Barbell_Deadlift', muscles: 'Tüm arka zincir',
    steps: ['Bar ayak ortasının üstünde. Eğil, barı tut, göğüs yukarı, sırt düz.', 'Yere basarak kalk, bar bacaklara sürtünerek yukarı.', 'Kalçanı geri iterek kontrollü indir.'],
    tips: ['Hareket öncesi karnını sık, nefes tut.', 'Bel yuvarlanıyorsa ağırlığı düşür.'], repRange: [5, 8],
  },
  {
    id: 'band_good_morning', name: 'Lastikle Good Morning', pattern: 'hinge', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Band_Good_Morning', muscles: 'Arka bacak, kalça, bel',
    steps: ['Lastiğin üstüne bas, diğer ucunu ensenden geçir.', 'Kalçanı geriye iterek öne eğil, sırt düz.', 'Kalçanı öne iterek kalk.'],
    tips: ['Dizler hafif bükülü.'], repRange: [12, 20],
  },

  // ---------- TEK BACAK / LUNGE ----------
  {
    id: 'reverse_lunge', name: 'Geri Lunge', pattern: 'lunge', tier: 2, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Bodyweight_Walking_Lunge', muscles: 'Bacak, kalça',
    steps: ['Ayakta, bir ayağını geriye at.', 'Arka dizini yere yaklaştır, ön diz 90 derece.', 'Ön topuktan iterek başa dön.'],
    tips: ['Öne lunge\'dan daha diz dostu.', 'Gövde dik.'], repRange: [8, 12],
  },
  {
    id: 'step_up', name: 'Basamağa Çıkış', pattern: 'lunge', tier: 2, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Step-up_with_Knee_Raise', muscles: 'Bacak, kalça',
    steps: ['Sağlam bir basamak/sandalye önünde dur.', 'Bir ayağını koy, o bacakla iterek çık.', 'Aynı bacakla kontrollü in.'],
    tips: ['Alttaki bacakla zıplama, üstteki bacak çalışsın.'], repRange: [8, 12],
  },
  {
    id: 'split_squat', name: 'Split Squat', pattern: 'lunge', tier: 3, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Split_Squats', muscles: 'Bacak, kalça',
    steps: ['Bir ayak önde bir ayak arkada büyük adım pozisyonu al.', 'Arka diz yere yaklaşana kadar dik in.', 'Ön topuktan iterek kalk; ayak yerini değiştirme.'],
    tips: ['Denge için duvara dokunabilirsin.'], repRange: [8, 12],
  },
  {
    id: 'db_split_squat', name: 'Dambıl Split Squat', pattern: 'lunge', tier: 4, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', perSide: true, img: 'Split_Squat_with_Dumbbells', muscles: 'Bacak, kalça',
    steps: ['Dambıllar yanlarda, adım pozisyonu.', 'Arka diz yere yaklaşana kadar in.', 'Ön topuktan iterek kalk.'],
    tips: ['Gövde dik, omuzlar geride.'], repRange: [8, 12],
  },
  {
    id: 'bulgarian_split_squat', name: 'Bulgar Split Squat', pattern: 'lunge', tier: 5, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Split_Squats', muscles: 'Bacak, kalça',
    steps: ['Arka ayağının üstünü bir sandalye/bench\'e koy.', 'Ön dizini bükerek dik in.', 'Ön topuktan iterek kalk.'],
    tips: ['Ön ayak sandalyeden yeterince uzak olsun.', 'Zorlaştırmak için dambıl tut.'], repRange: [8, 12],
  },
  {
    id: 'db_lunge', name: 'Dambıl Lunge', pattern: 'lunge', tier: 4, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', perSide: true, img: 'Dumbbell_Lunges', muscles: 'Bacak, kalça',
    steps: ['Dambıllar yanlarda, bir adım öne at.', 'Arka diz yere yaklaşsın, ön diz 90 derece.', 'Ön topuktan iterek başa dön.'],
    tips: ['Adımın çok kısa olmasın.'], repRange: [8, 12],
  },

  // ---------- KARIN / CORE ----------
  {
    id: 'knee_plank', name: 'Dizde Plank', pattern: 'core', tier: 1, equipment: [], load: 'bw', unit: 'sec', img: 'Plank', muscles: 'Karın, bel',
    steps: ['Dirsekler omuz altında, dizler yerde.', 'Dizden başa düz çizgi, karnını sık.', 'Süre boyunca nefes almaya devam et.'],
    tips: ['Kalça düşmesin, kalkmasın.'], repRange: [20, 45],
  },
  {
    id: 'plank', name: 'Plank', pattern: 'core', tier: 2, equipment: [], load: 'bw', unit: 'sec', img: 'Plank', muscles: 'Karın, bel, omuz',
    steps: ['Dirsekler omuz altında, ayak parmak uçları yerde.', 'Topuktan başa düz çizgi; kalçanı ve karnını sık.', 'Süre boyunca sabit kal.'],
    tips: ['Kalçan düşüyorsa süreyi kısalt, formu bozma.', 'Nefesini tutma.'], repRange: [20, 60],
  },
  {
    id: 'dead_bug', name: 'Dead Bug', pattern: 'core', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Dead_Bug', muscles: 'Derin karın',
    steps: ['Sırt üstü yat, kollar tavana, dizler 90 derece havada.', 'Belini yere bastırarak sağ kolu ve sol bacağı yavaşça uzat.', 'Geri dön, diğer tarafla tekrar et.'],
    tips: ['Bel yerden kalkmasın; kalkarsa daha az uzat.'], repRange: [8, 15],
  },
  {
    id: 'bird_dog', name: 'Bird Dog', pattern: 'core', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Superman', muscles: 'Bel, kalça, karın',
    steps: ['Dört ayak pozisyonu, eller omuz altında, dizler kalça altında.', 'Sağ kol ve sol bacağı aynı anda düz uzat.', 'Kontrollü dön, diğer tarafla tekrar et.'],
    tips: ['Kalça sağa sola dönmesin, bardak taşımıyormuş gibi dur.'], repRange: [8, 15],
  },
  {
    id: 'side_plank', name: 'Yan Plank', pattern: 'core', tier: 3, equipment: [], load: 'bw', unit: 'sec', perSide: true, img: 'Side_Bridge', muscles: 'Yan karın',
    steps: ['Yan yat, dirsek omuz altında.', 'Kalçanı kaldır, vücut düz çizgi.', 'Süre dolunca diğer tarafa geç.'],
    tips: ['Zorsa alt dizini yere koy.'], repRange: [15, 45],
  },
  {
    id: 'leg_raise', name: 'Yerde Bacak Kaldırma', pattern: 'core', tier: 3, equipment: [], load: 'bw', unit: 'reps', img: 'Flat_Bench_Lying_Leg_Raise', muscles: 'Alt karın',
    steps: ['Sırt üstü yat, eller kalçanın altında.', 'Bacakları düz tutarak 90 dereceye kaldır.', 'Yere değdirmeden yavaşça indir.'],
    tips: ['Bel yerden kalkıyorsa dizleri biraz bük.'], repRange: [8, 15],
  },
  {
    id: 'hollow_hold', name: 'Hollow Hold', pattern: 'core', tier: 4, equipment: [], load: 'bw', unit: 'sec', img: 'Flat_Bench_Lying_Leg_Raise', muscles: 'Tüm karın',
    steps: ['Sırt üstü yat, belini yere yapıştır.', 'Omuzları ve bacakları yerden biraz kaldır, kollar kulak yanında.', 'Pozisyonu koru.'],
    tips: ['Bel kalkıyorsa bacakları daha yükseğe al.'], repRange: [15, 40],
  },
  {
    id: 'mountain_climber', name: 'Dağcı (Mountain Climber)', pattern: 'core', tier: 3, equipment: [], load: 'bw', unit: 'reps', img: 'Mountain_Climbers', muscles: 'Karın, omuz, kondisyon',
    steps: ['Plank pozisyonu, eller omuz altında.', 'Dizini göğsüne çek, hızlıca bacak değiştir.', 'Kalça sabit, gövde düz.'],
    tips: ['Her iki diz bir tekrar sayılır.'], repRange: [16, 30],
  },
  {
    id: 'hanging_knee_raise', name: 'Barda Diz Çekme', pattern: 'core', tier: 4, equipment: ['pullupbar'], load: 'bw', unit: 'reps', img: 'Hanging_Leg_Raise', muscles: 'Alt karın, kavrama',
    steps: ['Barda asıl.', 'Dizlerini göğsüne doğru çek.', 'Kontrollü indir, sallanma.'],
    tips: ['Sallanmayı önlemek için karnını sık.'], repRange: [6, 15],
  },

  // ---------- KARDİYO / ISINMA ----------
  {
    id: 'jumping_jack', name: 'Jumping Jack', pattern: 'cardio', tier: 1, equipment: [], load: 'bw', unit: 'sec', img: 'Rope_Jumping', muscles: 'Tüm vücut, kondisyon',
    steps: ['Ayakta, kollar yanda.', 'Zıplayarak ayakları aç, kolları başının üstünde birleştir.', 'Zıplayarak başa dön.'],
    tips: ['Isınma için ideal.'], repRange: [30, 60],
  },
  {
    id: 'high_knees', name: 'Yüksek Diz Koşusu', pattern: 'cardio', tier: 2, equipment: [], load: 'bw', unit: 'sec', img: 'Mountain_Climbers', muscles: 'Bacak, kondisyon',
    steps: ['Yerinde koşar gibi dizlerini bel hizasına kaldır.', 'Kollarını koşar gibi salla.', 'Süre boyunca tempoyu koru.'],
    tips: ['Parmak ucunda yumuşak in.'], repRange: [20, 45],
  },
  {
    id: 'treadmill_walk', name: 'Koşu Bandında Tempolu Yürüyüş', pattern: 'cardio', tier: 1, equipment: ['treadmill'], load: 'bw', unit: 'sec', img: 'Walking_Treadmill', muscles: 'Bacak, kalp-akciğer',
    repRange: [300, 1200],
    steps: ['Bandı 5-6 km/sa hıza, %1-3 eğime ayarla.', 'Dik dur, kollar serbest sallansın; tutunma.', 'Konuşabilecek ama şarkı söyleyemeyecek tempoda yürü.'],
    tips: ['Hazır olunca eğimi artır, hızı değil.', 'Son 1 dk yavaşla ve soğu.'],
  },
  {
    id: 'treadmill_run', name: 'Koşu Bandında Hafif Koşu', pattern: 'cardio', tier: 3, equipment: ['treadmill'], load: 'bw', unit: 'sec', img: 'Jogging_Treadmill', muscles: 'Bacak, kalp-akciğer',
    repRange: [300, 1200],
    steps: ['2 dk yürüyerek ısın.', '8-9 km/sa hızda rahat koşu; adımlar kısa ve sessiz.', 'Zorlanınca 1 dk yürü, sonra devam.'],
    tips: ['Öne eğilme, bakış ileride.', 'Yüksek nabız hedefi yok; rahat tempo yeter.'],
  },
  {
    id: 'bike_steady', name: 'Bisiklette Tempolu Pedal', pattern: 'cardio', tier: 1, equipment: ['bike'], load: 'bw', unit: 'sec', img: 'Bicycling_Stationary', muscles: 'Bacak, kalp-akciğer',
    repRange: [300, 1200],
    steps: ['Sele kalça hizasında; pedal en altta diz hafif kırık.', 'Orta dirençte, dakikada ~80 pedal çevir.', 'Üst gövde rahat, omuzlar düşük.'],
    tips: ['Nefes kesilmeden konuşabilmelisin.', 'Her hafta 2-3 dk ekle.'],
  },
  {
    id: 'burpee', name: 'Burpee', pattern: 'cardio', tier: 4, equipment: [], load: 'bw', unit: 'reps', img: 'Pushups', muscles: 'Tüm vücut',
    steps: ['Çömel, ellerini yere koy.', 'Ayaklarını geriye at (plank), istersen bir şınav yap.', 'Ayaklarını geri çek, zıplayarak kalk.'],
    tips: ['Başlangıçta zıplamayı ve şınavı atla.'], repRange: [5, 12],
  },
]

export const EXERCISE_MAP: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]))

export const PATTERN_NAMES: Record<Pattern, string> = {
  squat: 'Squat (ön bacak)',
  hinge: 'Kalça / arka bacak',
  push: 'İtiş (göğüs)',
  vpush: 'Omuz',
  pull: 'Çekiş (sırt)',
  lunge: 'Tek bacak',
  core: 'Karın / core',
  cardio: 'Kondisyon',
}

export const EQUIPMENT: { id: EquipmentId; name: string; desc: string; emoji: string }[] = [
  { id: 'bodyweight', name: 'Hiçbir şey yok', desc: 'Sadece vücut ağırlığı', emoji: '🧍' },
  { id: 'dumbbell', name: 'Dambıl', desc: 'Sabit ya da ayarlanabilir', emoji: '🏋️' },
  { id: 'kettlebell', name: 'Kettlebell', desc: '', emoji: '🔔' },
  { id: 'barbell', name: 'Bar + plakalar', desc: 'Olimpik ya da düz bar', emoji: '➖' },
  { id: 'band', name: 'Direnç lastiği', desc: '', emoji: '➰' },
  { id: 'pullupbar', name: 'Barfiks barı', desc: 'Kapı tipi ya da sabit', emoji: '🪜' },
  { id: 'bench', name: 'Bench / sehpa', desc: 'Üstüne yatılabilen sağlam yüzey', emoji: '🛋️' },
  { id: 'treadmill', name: 'Koşu bandı', desc: 'Yürüyüş / koşu', emoji: '🏃' },
  { id: 'bike', name: 'Kondisyon bisikleti', desc: 'Sabit bisiklet / eliptik', emoji: '🚴' },
  { id: 'gym', name: 'Spor salonu', desc: 'Makineler, kablo vb.', emoji: '🏢' },
]

export function hasEquipment(ex: Exercise, owned: EquipmentId[]) {
  const set = new Set<EquipmentId>(owned)
  if (set.has('gym')) { set.add('dumbbell'); set.add('barbell'); set.add('bench'); set.add('pullupbar'); set.add('kettlebell'); set.add('treadmill'); set.add('bike') }
  return ex.equipment.every((e) => set.has(e))
}
