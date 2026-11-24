#!/usr/bin/env bash
# Sürüm numarasını artır, commit'le, push'la ve OTA güncellemesi olarak yayınla.
set -euo pipefail
cd "$(dirname "$0")/.."
f=src/lib/version.ts
n=$(( $(sed -nE 's/^export const RELEASE = ([0-9]+)$/\1/p' "$f") + 1 ))
sed -i.bak -E "s/^export const RELEASE = [0-9]+$/export const RELEASE = $n/" "$f" && rm -f "$f.bak"
git add "$f" && git commit -qm "Sürüm v1.$n" && git push -q
npx -y eas-cli@latest update --branch production --environment production --non-interactive --message "v1.$n${1:+ - $1}"
