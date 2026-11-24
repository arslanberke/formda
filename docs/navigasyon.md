# Menü ve gezinme kuralları

Kaynaklar: Apple Human Interface Guidelines (Tab bars, Modality, Sheets), Nielsen'in 10 kullanılabilirlik ilkesi, Don Norman'ın "mapping" (eşleme) ilkesi.

1. **Sekme çubuğu sadece bölüm değiştirir, işlem yapmaz.** 5 sekme, tek kelimelik etiket, hep görünür. Seçili sekmenin ikonu dolu olur. Sekme içinden başka sekmeye `router.navigate` ile geçilir, `push` ile kopya açılmaz.
2. **Hiyerarşi = itme (push).** Bir listeden daha ayrıntılı bir sayfaya gidiliyorsa (Hareketler) sağdan gelir, sol üstte "‹ Geri" vardır, kaydırarak geri dönülür.
3. **Kısa, kendi içinde biten iş = sayfa (sheet).** Yemek ekle, koşu ekle, hareket detayı alttan açılır, aşağı kaydırınca kapanır.
   - Sadece bakılan sayfa: sağ üstte **Kapat**.
   - Bilgi girilen sayfa: sol üstte **Vazgeç**, altta ana buton **Kaydet**. Girilen veri varsa Vazgeç onay ister.
   - Sayfanın üstüne ikinci sayfa açılmaz; sayfa içinde alt hiyerarşi kurulmaz (benzer hareketler aynı sayfada yer değiştirir).
4. **Uzun, odak isteyen iş = tam ekran akış.** Antrenman ve kapasite testi; sol üstte çarpı / Vazgeç, iptal onay ister, kaydırarak yanlışlıkla çıkılmaz.
5. **Adımlı akış** (kayıt, test): üstte ilerleme çubuğu, altta solda "Geri", sağda "Devam". Düzenleme modunda sol üstte "Vazgeç" ile her an çıkılabilir.
6. **Eşleme (mapping):** kontrol, etkilediği şeyin yönünde durur. Önceki solda / sonraki sağda, azalt (−) solda / artır (+) sağda, geçmiş gün ‹ solda / ileri gün › sağda (bugünden ileri gidilmez). Antrenmandaki ilerleme parçaları hareket sırasıyla aynıdır, dokununca o harekete gider.
7. **Akış bitince geldiğin yere dön:** antrenman/test bitince ana sekmelere `router.dismissTo('/(tabs)')` ile dönülür, yığına yeni ekran eklenmez.
8. **Tutarlılık:** aynı iş her yerde aynı adla: Kapat, Vazgeç, Kaydet, Geri, Devam.
