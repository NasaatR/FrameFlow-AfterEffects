#!/bin/bash
set -eu
# User-level install; no sudo, downloads, quarantine changes or global AE preferences.
package_root="$(cd "$(dirname "$0")/.." && pwd)"
extensions_root="$HOME/Library/Application Support/Adobe/CEP/extensions"
frameflow_root="$HOME/Library/Application Support/FrameFlow"
destination="$extensions_root/com.frameflow.ae"
backup="$frameflow_root/backups/$(date '+%Y%m%d-%H%M%S')"
staging="$frameflow_root/staging-$$"
domain="com.adobe.CSXS.12"
test -f "$package_root/extension/CSXS/manifest.xml"
mkdir -p "$extensions_root" "$backup"
printf '%s\n' 'FrameFlow 2.5.0 / AE 25-27 / CEP 12' 'Restart After Effects after installation so it rescans extensions.' 'Installs for this account and enables unsigned CEP 12 panels.'
if defaults read "$domain" PlayerDebugMode > "$backup/debug-value.txt" 2>/dev/null; then printf 'present\n' > "$backup/debug-state.txt"; else printf 'absent\n' > "$backup/debug-state.txt"; fi
if defaults read-type "$domain" PlayerDebugMode > "$backup/debug-type.txt" 2>/dev/null; then :; fi
if test -d "$destination"; then printf 'present\n' > "$backup/extension-state.txt"; else printf 'absent\n' > "$backup/extension-state.txt"; fi
placed_new=0
moved_old=0
restore_debug() {
  if test "$(cat "$backup/debug-state.txt")" = present; then
    if grep -q integer "$backup/debug-type.txt"; then defaults write "$domain" PlayerDebugMode -int "$(cat "$backup/debug-value.txt")";
    elif grep -q boolean "$backup/debug-type.txt"; then defaults write "$domain" PlayerDebugMode -bool "$(cat "$backup/debug-value.txt")";
    else defaults write "$domain" PlayerDebugMode -string "$(cat "$backup/debug-value.txt")"; fi
  else defaults delete "$domain" PlayerDebugMode 2>/dev/null || true; fi
}
recover() {
  original_exit=$?
  trap - ERR
  set +e
  if test "$placed_new" = 1; then mv "$destination" "$backup/failed-new-extension"; fi
  if test "$moved_old" = 1; then mv "$backup/extension" "$destination"; fi
  restore_debug
  printf '%s\n' "Installation failed ($original_exit). Recovery attempted; backup: $backup"
  exit "$original_exit"
}
trap recover ERR
cp -R "$package_root/extension" "$staging"
if test -d "$destination"; then mv "$destination" "$backup/extension"; moved_old=1; fi
mv "$staging" "$destination"
placed_new=1
defaults write "$domain" PlayerDebugMode -string 1
test "$(defaults read "$domain" PlayerDebugMode)" = 1
trap - ERR
printf '%s\n' "Installed: $destination" "Backup: $backup" 'After restarting AE, open Window > Extensions (Legacy) > FrameFlow 2.5.'
printf '%s\n' 'To restore, follow install/RESTORE_MACOS_RU.md.'
read -r -p 'Press Enter to close.' _frameflow_answer
