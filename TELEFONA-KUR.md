# Formda'yı iPhone'a gerçek uygulama olarak kur

SportPulse'la aynı yöntem: Mac + Xcode + ücretsiz Apple ID. Telefon kabloyla ya da (daha önce Xcode'da eşleştiyse) aynı Wi-Fi'den bulunur. İmza 7 günde bir dolar.

## İlk kurulum (bir kere)

1. Mac'te Terminal'i aç:
   ```bash
   cd ~ && git clone https://github.com/arslanberke/formda.git && cd formda
   npm install
   ```
2. iPhone kabloyla bağlı ya da Mac ile aynı Wi-Fi'de olsun, kilidini aç.
3. Kur:
   ```bash
   npm run release:phone
   ```
   İlk seferde Xcode imza takımı sorarsa: `ios/Formda.xcworkspace`'i Xcode'da aç → Formda hedefi → Signing & Capabilities → Team: kendi Apple ID'n (Personal Team) → tekrar `npm run release:phone`.
4. Telefonda: Ayarlar → Genel → VPN ve Cihaz Yönetimi → Geliştirici Uygulaması → Güven.

## 7 gün dolunca

```bash
cd ~/formda && npm run renew:phone && npm run release:phone
```

## Güncellemeler

Yeni özellikleri `eas update` ile yayınlıyorum; uygulamayı kapatıp açınca kendiliğinden iner, yeniden kurman gerekmez. Sadece yeni bir native modül eklendiğinde `npm run release:phone` gerekir.

## Mac yoksa

Expo Go → rljer hesabıyla giriş → Projects → formda → production. Ya da link:
`exp://u.expo.dev/40d7e7ac-5283-4657-bf88-15aa32882b94?runtime-version=exposdk:58.0.0&channel-name=production`
