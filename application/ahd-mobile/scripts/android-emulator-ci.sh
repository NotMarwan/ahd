#!/usr/bin/env bash
# Ahd Pilot — emulator exercise: install, journey, launch timings, jank, logcat.
# Runs inside the GitHub Actions android-emulator-runner step (emulator already booted).
set -euo pipefail

APP_ID="sa.ahd.mobile"
APK_PATH="${1:-artifacts/ahd-pilot-v1.apk}"
OUT_DIR="${2:-artifacts/emulator-evidence}"
ACTIVITY="$APP_ID/.MainActivity"

mkdir -p "$OUT_DIR"

echo "== install =="
adb install -r "$APK_PATH"

echo "== clear logcat =="
adb logcat -c || true

echo "== reset journey frame counters =="
adb shell dumpsys gfxinfo "$APP_ID" reset > /dev/null || true

echo "== maestro customer journey =="
export MAESTRO_DRIVER_STARTUP_TIMEOUT=120000
maestro test .maestro/pilot-journey.yaml --format junit --output "$OUT_DIR/maestro-report.xml"

echo "== journey frame stats (before any restart clears them) =="
adb shell dumpsys gfxinfo "$APP_ID" > "$OUT_DIR/gfxinfo.txt" || true

echo "== cold starts (3 runs) =="
: > "$OUT_DIR/cold-starts.txt"
for i in 1 2 3; do
  adb shell am force-stop "$APP_ID"
  sleep 3
  adb shell am start -W -n "$ACTIVITY" | tee -a "$OUT_DIR/cold-starts.txt"
  sleep 5
done

echo "== warm start =="
adb shell input keyevent KEYCODE_HOME
sleep 2
adb shell am start -W -n "$ACTIVITY" | tee "$OUT_DIR/warm-start.txt"
sleep 3

echo "== logcat dump =="
adb logcat -d > "$OUT_DIR/logcat.txt"

echo "== perf gate =="
node scripts/android-perf.mjs "$OUT_DIR"
