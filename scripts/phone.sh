#!/usr/bin/env bash
#
# Formda'yı Mac'ten, USB ya da aynı Wi-Fi'deki iPhone'a gerçek uygulama olarak kurar
# (SportPulse'taki `npm run release:phone` ile aynı yöntem; ücretsiz Apple ID).
#
# Kullanım:
#   ./scripts/phone.sh release   En güncel kodu çekip Release derler, telefona kurar, OTA yayınlar
#   ./scripts/phone.sh renew     7 gün dolunca imza profilini yeniler (sonra release)
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -z "${DEVELOPER_DIR:-}" ]]; then
  for candidate in /Applications/Xcode.app /Applications/Xcode-beta.app; do
    if [[ -d "$candidate/Contents/Developer" ]]; then
      export DEVELOPER_DIR="$candidate/Contents/Developer"
      break
    fi
  done
fi

# Önce USB'ye bakar; yoksa aynı Wi-Fi'deki eşleşmiş iPhone'u (Xcode "Connect via network") bulur.
attached_device() {
  local id
  id=$(idevice_id -l 2>/dev/null | head -1 || true)
  if [[ -z "$id" ]]; then
    local tmp
    tmp=$(mktemp)
    xcrun devicectl list devices --json-output "$tmp" >/dev/null 2>&1 || true
    id=$(node -e '
      try {
        const d = require(process.argv[1]).result.devices
        const p = d.find((x) => x.hardwareProperties?.reality === "physical" && x.hardwareProperties?.platform === "iOS" && x.hardwareProperties?.udid)
        if (p) process.stdout.write(p.hardwareProperties.udid)
      } catch {}' "$tmp" 2>/dev/null || true)
    rm -f "$tmp"
  fi
  printf '%s' "$id"
}

pull_latest() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Uyarı: kaydedilmemiş değişiklik var, en güncel kod çekilmedi." >&2
    return 0
  fi
  git fetch origin main && git checkout main && git merge --ff-only origin/main ||
    echo "Uyarı: en güncel kod çekilemedi, mevcut kodla derleniyor." >&2
}

# expo-updates gömülü paketten eski güncellemeyi almaz; derlemeden sonra aynı
# kodu OTA olarak da yayınlarız ki sonraki güncellemeler sorunsuz gelsin.
publish_update() {
  if ! npx -y eas-cli@latest whoami >/dev/null 2>&1; then
    echo "Uyarı: EAS girişi yok, güncelleme yayınlanmadı." >&2
    return 0
  fi
  npx -y eas-cli@latest update --channel production --platform ios \
    --message "Derleme sonrası güncel hal" --non-interactive ||
    echo "Uyarı: güncelleme yayınlanamadı." >&2
}

case "${1:-release}" in
release)
  shift || true
  if [[ $# -eq 0 ]] && udid=$(attached_device) && [[ -n "$udid" ]]; then
    set -- "$udid"
  fi
  pull_latest
  npm install --no-audit --no-fund
  npx expo prebuild -p ios
  npx expo run:ios --configuration Release --device "$@"
  publish_update
  exit 0
  ;;
renew)
  # Ücretsiz hesabın profili 7 günde dolar; expo run:ios profili kendisi yenileyemez.
  udid=$(attached_device)
  if [[ -z "$udid" ]]; then
    echo "iPhone bulunamadı. Kabloyla tak ya da aynı Wi-Fi'de kilidini aç." >&2
    exit 1
  fi
  npx expo prebuild -p ios
  cd ios && xcodebuild -workspace Formda.xcworkspace -scheme Formda \
    -configuration Release -destination "id=$udid" \
    -allowProvisioningUpdates build
  echo "Telefonda: Ayarlar > Genel > VPN ve Cihaz Yönetimi > Geliştirici Uygulaması > Güven"
  ;;
*)
  sed -n '/^# Kullanım:/,/^set -euo/p' "$0" | sed 's/^# \{0,1\}//;$d' >&2
  exit 1
  ;;
esac
