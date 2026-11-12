# Formda

Hiç spor bilmeyenler için kişiye göre uyarlanan iOS fitness + yaşam takibi uygulaması (Expo / React Native, Expo Go ile çalışır).

- Ekipmanına göre hareket seçer, önce kapasite testi yapar, seviyene göre set/tekrar/ağırlık verir
- Her antrenman sonrası kolay/normal/zor geri bildirimiyle programı kendisi artırır/hafifletir
- Resimli Türkçe hareket anlatımı, dinlenme sayacı
- Kalori/makro hedefi, Türkçe yiyecek tablosu + Open Food Facts araması, su takibi
- Kilo ve ölçü takibi, grafik; JSON yedek al / yükle

## Telefonda açma (Expo Go)

Expo Go'da şu linki aç (ya da QR'ı okut):

```
exp://u.expo.dev/40d7e7ac-5283-4657-bf88-15aa32882b94?runtime-version=exposdk:58.0.0&channel-name=production
```

## Geliştirme

```
npm install
npm start            # Expo dev server
npx tsc --noEmit     # tip kontrolü
npx eslint src       # lint
npm run publish      # yeni sürümü Expo Go'ya yayınla (EXPO_TOKEN gerekir)
```
