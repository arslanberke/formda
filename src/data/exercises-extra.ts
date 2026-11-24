import type { Exercise } from './exercises'

type X = Omit<Exercise, 'steps' | 'tips'> & { steps: string[]; tips: string[] }

// Ekipmana göre seçenekleri genişleten ek hareketler (lastik, ağırlıklı eğilme, kol, kardiyo).
export const EXTRA: X[] = [
  // ---------- LASTİK ----------
  {
    id: 'band_pull_apart', name: 'Lastik Açma (Pull-Apart)', pattern: 'pull', tier: 1, equipment: ['band'], load: 'band', unit: 'reps', img: 'Band_Pull_Apart', muscles: 'Arka omuz, kürek kemikleri',
    steps: ['Lastiği omuz genişliğinde iki elle tut, kollar önde göğüs hizasında.', 'Kolları düz tutarak lastiği göğsüne doğru iki yana aç.', 'Kürek kemiklerini sıkıp yavaşça geri getir.'],
    tips: ['Omuzlarını kulaklarına doğru kaldırma.', 'Masa başında çalışanlar için duruş ilacı.'], repRange: [12, 20],
  },
  {
    id: 'band_face_pull', name: 'Lastikle Face Pull', pattern: 'pull', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Face_Pull', muscles: 'Arka omuz, üst sırt',
    steps: ['Lastiği göz hizasında bir kapı koluna/direğe bağla.', 'Elleri yüzüne doğru çek, dirsekler yukarıda ve dışarıda.', 'Sonda elleri kulak yanına aç, yavaşça bırak.'],
    tips: ['Gövdeyi geriye yatırarak çekme.'], repRange: [12, 20],
  },
  {
    id: 'band_reverse_fly', name: 'Lastikle Ters Fly', pattern: 'pull', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Back_Flyes_-_With_Bands', muscles: 'Arka omuz, sırt',
    steps: ['Lastiğin ortasına bas, öne hafif eğil, sırt düz.', 'Kollar hafif bükülü, lastiği iki yana kanat gibi aç.', 'Yavaşça indir.'],
    tips: ['Ağırlık değil kontrol önemli.'], repRange: [12, 20],
  },
  {
    id: 'band_lateral_raise', name: 'Lastikle Yana Açış', pattern: 'vpush', tier: 1, equipment: ['band'], load: 'band', unit: 'reps', img: 'Lateral_Raise_-_With_Bands', muscles: 'Yan omuz',
    steps: ['Lastiğin ortasına bas, uçları iki elinde.', 'Kolları hafif bükülü yana, omuz hizasına kadar kaldır.', 'Yavaşça indir.'],
    tips: ['Omuz hizasından yukarı çıkma.'], repRange: [12, 20],
  },
  {
    id: 'band_upright_row', name: 'Lastikle Dik Kürek', pattern: 'vpush', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Upright_Row_-_With_Bands', muscles: 'Omuz, trapez',
    steps: ['Lastiğe bas, ellerin önde yakın tut.', 'Dirsekleri yana-yukarı kaldırarak elleri göğüs hizasına çek.', 'Kontrollü indir.'],
    tips: ['Omzun sıkışıyorsa yana açışa geç.'], repRange: [10, 15],
  },
  {
    id: 'band_squat', name: 'Lastikle Squat', pattern: 'squat', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Squat_with_Bands', muscles: 'Ön bacak, kalça',
    steps: ['Lastiğin ortasına omuz genişliğinde bas, uçları omuzlarında tut.', 'Kalçanı geriye ve aşağı indir, göğüs yukarı.', 'Topuklardan iterek kalk; en üstte lastik en gergin.'],
    tips: ['Dizler ayak ucu yönünde.'], repRange: [12, 20],
  },
  {
    id: 'band_pull_through', name: 'Lastikle Pull-Through', pattern: 'hinge', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', img: 'Band_Good_Morning_Pull_Through', muscles: 'Kalça, arka bacak',
    steps: ['Lastiği arkanda alçak bir yere bağla, bacaklarının arasından tut.', 'Kalçanı geriye iterek eğil, sırt düz.', 'Kalçanı sıkıp öne iterek dikleş.'],
    tips: ['Kollarla çekme, hareket kalçadan.'], repRange: [12, 20],
  },
  {
    id: 'band_curl', name: 'Lastikle Pazı Curl', pattern: 'arms', tier: 1, equipment: ['band'], load: 'band', unit: 'reps', img: 'Close-Grip_EZ-Bar_Curl_with_Band', muscles: 'Pazı (ön kol)',
    steps: ['Lastiğin ortasına bas, uçları avuçlar önde tut.', 'Dirsekleri gövdeye yapıştırıp elleri omuza kaldır.', 'Yavaşça indir.'],
    tips: ['Gövdeyi sallama.'], repRange: [12, 20],
  },
  {
    id: 'band_triceps', name: 'Lastikle Arka Kol (Baş Üstü)', pattern: 'arms', tier: 1, equipment: ['band'], load: 'band', unit: 'reps', img: 'Speed_Band_Overhead_Triceps', muscles: 'Arka kol',
    steps: ['Lastiğin bir ucuna arkada bas, diğer ucu iki elle başının arkasında.', 'Dirsekler yukarıda sabit, elleri tavana doğru uzat.', 'Kontrollü geri bük.'],
    tips: ['Dirsekler yana açılmasın.'], repRange: [12, 20],
  },
  {
    id: 'pallof_press', name: 'Pallof Press (Lastik)', pattern: 'core', tier: 2, equipment: ['band'], load: 'band', unit: 'reps', perSide: true, img: 'Pallof_Press', muscles: 'Karın, yan karın',
    steps: ['Lastiği göğüs hizasında yana bağla, yan dur.', 'Elleri göğsünün önünden ileri uzat; lastik seni döndürmeye çalışacak, izin verme.', '2 sn bekle, geri çek.'],
    tips: ['Kalça ve omuzlar hep öne baksın.'], repRange: [8, 12],
  },

  // ---------- AĞIRLIKLA EĞİLİP KALKMA (KALÇA) ----------
  {
    id: 'db_good_morning', name: 'Dambılla Good Morning', pattern: 'hinge', tier: 2, equipment: ['dumbbell'], load: 'dumbbell1', unit: 'reps', img: 'Good_Morning', muscles: 'Arka bacak, kalça, bel',
    steps: ['Tek dambılı iki elle göğsüne yasla, ayaklar kalça genişliğinde.', 'Dizler hafif bükülü, kalçanı geriye iterek gövdeni yere paralele yakın eğ.', 'Kalçanı öne iterek dikleş.'],
    tips: ['Sırt hep düz; bel yuvarlanırsa daha az eğil.', 'Hafif başla, bu hareket arka bacağı çok çalıştırır.'], repRange: [10, 15],
  },
  {
    id: 'bb_good_morning', name: 'Barla Good Morning', pattern: 'hinge', tier: 4, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Good_Morning', muscles: 'Arka bacak, kalça, bel',
    steps: ['Bar sırtında squat gibi yerleşsin.', 'Dizler hafif bükülü, kalçayı geriye iterek öne eğil.', 'Arka bacakta gerilmeyi hissedince kalçayı öne iterek kalk.'],
    tips: ['Sadece bar ile başla.', 'Sırt düz, bakış hafif önde.'], repRange: [8, 12],
  },
  {
    id: 'db_stiff_deadlift', name: 'Dambılla Deadlift', pattern: 'hinge', tier: 3, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Stiff-Legged_Dumbbell_Deadlift', muscles: 'Arka bacak, kalça, sırt',
    steps: ['İki dambıl önünde, ayaklar kalça genişliğinde.', 'Kalçayı geriye iterek dambılları bacaklarına yakın indir (diz altına kadar).', 'Kalçayı sıkarak dikleş.'],
    tips: ['Dambıllar bacaklara yakın kalsın.'], repRange: [8, 12],
  },
  {
    id: 'bb_hip_thrust', name: 'Barla Hip Thrust', pattern: 'hinge', tier: 4, equipment: ['barbell', 'bench'], load: 'barbell', unit: 'reps', img: 'Barbell_Hip_Thrust', muscles: 'Kalça',
    steps: ['Sırtının üstü bench kenarında, bar kalça kemiğinin üstünde (havlu koy).', 'Topuklardan iterek kalçanı yukarı kaldır, gövde yere paralel.', 'Üstte 1 sn sık, kontrollü indir.'],
    tips: ['Çene hafif göğüste, bel boşluğu açılmasın.'], repRange: [8, 12],
  },
  {
    id: 'superman', name: 'Superman', pattern: 'hinge', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Superman', muscles: 'Bel, kalça, sırt',
    steps: ['Yüzüstü uzan, kollar ileride.', 'Kolları, göğsü ve bacakları aynı anda yerden hafif kaldır.', '2 sn bekle, indir.'],
    tips: ['Boyun nötr, yere bak.'], repRange: [10, 15],
  },

  // ---------- OMUZ / GÖĞÜS (3D) ----------
  {
    id: 'db_arnold_press', name: 'Arnold Press', pattern: 'vpush', tier: 4, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Shoulder_Press', muscles: 'Omuz (ön-yan), arka kol',
    steps: ['Dambıllar göğüs önünde, avuçlar sana dönük.', 'İterken bilekleri çevir; en üstte avuçlar öne baksın.', 'İnerken ters çevirerek başa dön.'],
    tips: ['Klasik omuz presten hafif dambıl seç.'], repRange: [8, 12],
  },
  {
    id: 'db_front_raise', name: 'Dambılla Öne Kaldırış', pattern: 'vpush', tier: 2, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Front_Dumbbell_Raise', muscles: 'Ön omuz',
    steps: ['Dambıllar uyluk önünde.', 'Kollar hafif bükülü, omuz hizasına kadar öne kaldır.', 'Yavaşça indir.'],
    tips: ['Gövdeyi geriye atma.'], repRange: [10, 15],
  },
  {
    id: 'db_upright_row', name: 'Dambılla Dik Kürek', pattern: 'vpush', tier: 3, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Upright_Row_-_With_Bands', muscles: 'Omuz, trapez',
    steps: ['Dambıllar uyluk önünde.', 'Dirsekleri yana-yukarı kaldırarak dambılları göğüs hizasına çek.', 'Kontrollü indir.'],
    tips: ['Omzun sıkışıyorsa yükseklikten kıs.'], repRange: [10, 15],
  },
  {
    id: 'kb_press', name: 'Kettlebell Omuz Pres', pattern: 'vpush', tier: 3, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', perSide: true, img: 'Kettlebell_Arnold_Press', muscles: 'Omuz, arka kol, core',
    steps: ['Kettlebell omuz önünde (raf pozisyonu).', 'Karnı sık, başının üstüne düz it.', 'Kontrollü omza indir.'],
    tips: ['Belini geriye bükme.'], repRange: [6, 10],
  },
  {
    id: 'db_fly', name: 'Dambıl Fly', pattern: 'push', tier: 3, equipment: ['dumbbell', 'bench'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Flyes', muscles: 'Göğüs',
    steps: ['Bench\'e sırtüstü yat, dambıllar göğüs üstünde, avuçlar karşılıklı.', 'Dirsekler hafif bükülü, kolları iki yana yay çizerek aç.', 'Göğsü sıkarak kucaklar gibi geri topla.'],
    tips: ['Hafif ağırlık; omzu zorlayacak kadar açma.'], repRange: [10, 15],
  },

  // ---------- BACAK (3D) ----------
  {
    id: 'bb_front_squat', name: 'Front Squat (Bar)', pattern: 'squat', tier: 5, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Front_Barbell_Squat', muscles: 'Ön bacak, kalça, core',
    steps: ['Bar omuzlarının önünde, dirsekler yukarı.', 'Gövde dik, kalçayı aşağı indir.', 'Topuklardan iterek kalk.'],
    tips: ['Dirsekler düşerse bar öne kayar.'], repRange: [5, 8],
  },
  {
    id: 'bb_reverse_lunge', name: 'Barla Geri Lunge', pattern: 'lunge', tier: 4, equipment: ['barbell'], load: 'barbell', unit: 'reps', perSide: true, img: 'Barbell_Lunge', muscles: 'Bacak, kalça',
    steps: ['Bar sırtında, ayakta dur.', 'Bir ayağını geriye at, arka dizini yere yaklaştır.', 'Ön topuktan iterek başa dön.'],
    tips: ['Önce dambılla ya da boş barla öğren.'], repRange: [6, 10],
  },
  {
    id: 'glute_kickback', name: 'Kalça Geri Tekme', pattern: 'lunge', tier: 1, equipment: [], load: 'bw', unit: 'reps', perSide: true, img: 'Glute_Kickback', muscles: 'Kalça',
    steps: ['Dizler ve eller yerde (masa pozisyonu).', 'Bir bacağını dizi bükülü halde tavana doğru it.', 'Kalçayı sıkıp yavaşça indir.'],
    tips: ['Belini çukurlaştırma.'], repRange: [12, 20],
  },

  // ---------- KOL ----------
  {
    id: 'db_curl', name: 'Dambıl Pazı Curl', pattern: 'arms', tier: 2, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Dumbbell_Bicep_Curl', muscles: 'Pazı',
    steps: ['Dambıllar yanlarda, avuçlar öne.', 'Dirsekleri sabit tutup dambılları omza kaldır.', 'Yavaşça indir.'],
    tips: ['Sallanmadan kaldıramıyorsan ağırlık fazla.'], repRange: [8, 15],
  },
  {
    id: 'db_hammer_curl', name: 'Çekiç Curl', pattern: 'arms', tier: 2, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Hammer_Curls', muscles: 'Pazı, ön kol',
    steps: ['Dambıllar yanlarda, avuçlar birbirine dönük.', 'Bilekleri çevirmeden omza kaldır.', 'Yavaşça indir.'],
    tips: ['Dirsekler gövdeye yakın.'], repRange: [8, 15],
  },
  {
    id: 'bb_curl', name: 'Barla Pazı Curl', pattern: 'arms', tier: 3, equipment: ['barbell'], load: 'barbell', unit: 'reps', img: 'Barbell_Curl', muscles: 'Pazı',
    steps: ['Barı omuz genişliğinde, avuçlar öne tut.', 'Dirsekler sabit, barı göğse kaldır.', 'Kontrollü indir.'],
    tips: ['Belinle sallanma.'], repRange: [8, 12],
  },
  {
    id: 'db_triceps_ext', name: 'Baş Üstü Arka Kol (Dambıl)', pattern: 'arms', tier: 2, equipment: ['dumbbell'], load: 'dumbbell1', unit: 'reps', img: 'Standing_Dumbbell_Triceps_Extension', muscles: 'Arka kol',
    steps: ['Tek dambılı iki elle başının üstünde tut.', 'Dirsekler tavana bakarken dambılı ensene indir.', 'Kolları uzatarak geri it.'],
    tips: ['Dirsekleri yana açma.'], repRange: [10, 15],
  },
  {
    id: 'db_kickback', name: 'Arka Kol Kickback', pattern: 'arms', tier: 2, equipment: ['dumbbell'], load: 'dumbbell', unit: 'reps', img: 'Tricep_Dumbbell_Kickback', muscles: 'Arka kol',
    steps: ['Öne eğil, sırt düz, üst kollar gövdeye paralel.', 'Dirseği sabit tutup ön kolu geriye uzat.', 'Yavaşça geri bük.'],
    tips: ['Hafif dambıl yeterli.'], repRange: [12, 15],
  },
  {
    id: 'kb_triceps', name: 'Kettlebell Arka Kol', pattern: 'arms', tier: 2, equipment: ['kettlebell'], load: 'kettlebell', unit: 'reps', img: 'Standing_Dumbbell_Triceps_Extension', muscles: 'Arka kol',
    steps: ['Kettlebell\'i boynuzlarından iki elle baş üstünde tut.', 'Dirsekler sabit, ensene indir.', 'Uzatarak geri it.'],
    tips: ['Karnını sık, beli bükme.'], repRange: [10, 15],
  },
  {
    id: 'bench_dips', name: 'Sandalyede Dips', pattern: 'arms', tier: 2, equipment: [], load: 'bw', unit: 'reps', img: 'Bench_Dips', muscles: 'Arka kol, göğüs, ön omuz',
    steps: ['Sağlam bir sandalye/kanepe kenarına ellerinle tutun, kalça önde.', 'Dirsekleri geriye bükerek kalçanı indir (90°).', 'Elleriyle iterek yukarı çık.'],
    tips: ['Kolaylaştırmak için dizleri bük, zorlaştırmak için bacakları uzat.', 'Omzun ağrırsa daha az in.'], repRange: [8, 15],
  },

  {
    id: 'close_incline_pushup', name: 'Dar Eğimli Şınav', pattern: 'arms', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Incline_Push-Up_Close-Grip', muscles: 'Arka kol, göğüs',
    steps: ['Ellerini omuz genişliğinden dar şekilde masa/tezgah kenarına koy.', 'Dirsekleri gövdene yakın tutarak göğsünü kenara indir.', 'Arka kolunla iterek yukarı çık.'],
    tips: ['Yüzey ne kadar yüksekse o kadar kolay.', 'Dirsekler yana açılmasın.'], repRange: [8, 15],
  },
  {
    id: 'diamond_pushup', name: 'Dar Şınav', pattern: 'arms', tier: 3, equipment: [], load: 'bw', unit: 'reps', img: 'Push-Ups_-_Close_Triceps_Position', muscles: 'Arka kol, göğüs, ön omuz',
    steps: ['Şınav pozisyonu al, eller göğsünün altında, birbirine yakın.', 'Dirsekleri gövdeye sürterek göğsünü ellerine indir.', 'Kollarını düzelterek yukarı it.'],
    tips: ['Zor gelirse dizlerin yerde yap.', 'Bel çökmesin.'], repRange: [5, 12],
  },

  // ---------- CORE ----------
  {
    id: 'farmers_walk', name: 'Çiftçi Yürüyüşü', pattern: 'core', tier: 2, equipment: ['dumbbell'], load: 'dumbbell', unit: 'sec', img: 'Farmers_Walk', muscles: 'Kavrama, core, trapez',
    steps: ['İki ağır dambılı yanlarında tut.', 'Dik dur, omuzlar geride, küçük adımlarla yürü.', 'Süre bitince yavaşça bırak.'],
    tips: ['Ev içinde gidip gelmek yeterli.'], repRange: [30, 60],
  },
  {
    id: 'russian_twist', name: 'Russian Twist', pattern: 'core', tier: 2, equipment: [], load: 'bw', unit: 'reps', img: 'Russian_Twist', muscles: 'Yan karın',
    steps: ['Otur, dizler bükülü, gövdeni hafif geriye yatır.', 'Ellerini birleştirip gövdeni sağa-sola çevir.', 'Her iki taraf 1 tekrar.'],
    tips: ['Zorlaştırmak için ayakları kaldır ya da dambıl tut.'], repRange: [12, 24],
  },
  {
    id: 'crunch', name: 'Mekik (Crunch)', pattern: 'core', tier: 1, equipment: [], load: 'bw', unit: 'reps', img: 'Crunches', muscles: 'Karın',
    steps: ['Sırtüstü yat, dizler bükülü, eller göğüste.', 'Karnını sıkarak omuzlarını yerden kaldır.', 'Yavaşça indir.'],
    tips: ['Boynundan çekme.'], repRange: [12, 20],
  },

  // ---------- KONDİSYON ----------
  {
    id: 'treadmill_incline', name: 'Koşu Bandında Eğimli Yürüyüş', pattern: 'cardio', tier: 2, equipment: ['treadmill'], load: 'bw', unit: 'sec', img: 'Walking_Treadmill', muscles: 'Bacak, kalça, kalp-akciğer',
    steps: ['Eğimi %6-10\'a, hızı 4,5-5,5 km/s\'e ayarla.', 'Tutunmadan, dik yürü.', 'Nefesin hızlansın ama konuşabil.'],
    tips: ['Koşmadan yağ yakmanın en eklem dostu yolu.', 'Apple Watch\'ta "İç Mekan Yürüyüş" başlat.'], repRange: [600, 1800],
  },
  {
    id: 'elliptical', name: 'Eliptik', pattern: 'cardio', tier: 2, equipment: ['bike'], load: 'bw', unit: 'sec', img: 'Elliptical_Trainer', muscles: 'Tüm vücut, kalp-akciğer',
    steps: ['Pedallara bas, kolları tut.', 'Orta dirençte akıcı bir ritim tut.', 'Kollarla da it-çek.'],
    tips: ['Diz dostu kardiyo.'], repRange: [600, 1800],
  },
]
