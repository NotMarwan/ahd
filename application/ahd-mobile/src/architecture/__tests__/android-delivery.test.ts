import * as fs from 'fs';
import * as path from 'path';

import { describe, expect, it } from '@jest/globals';

const APP_ROOT = path.join(__dirname, '..', '..', '..');
const REPO_ROOT = path.join(APP_ROOT, '..', '..');

function read(relative: string): string {
  return fs.readFileSync(path.join(APP_ROOT, relative), 'utf8');
}

describe('Android Pilot delivery configuration', () => {
  it('keeps the Android application ID pinned to sa.ahd.mobile', () => {
    const appConfig = JSON.parse(read('app.json')) as {
      expo: { android: { package: string; versionCode: number } };
    };
    expect(appConfig.expo.android.package).toBe('sa.ahd.mobile');
    expect(Number.isSafeInteger(appConfig.expo.android.versionCode)).toBe(true);
  });

  it('declares a pilot preview build profile without store submission or auto-increment', () => {
    const eas = JSON.parse(read('eas.json')) as {
      build: Record<string, { distribution?: string; android?: { buildType?: string }; autoIncrement?: boolean }>;
    };
    const pilot = eas.build.pilot;
    expect(pilot).toBeDefined();
    expect(pilot.distribution).toBe('internal');
    expect(pilot.android?.buildType).toBe('apk');
    expect(pilot.autoIncrement).not.toBe(true);
    expect(JSON.stringify(eas)).not.toContain('"submit"');
  });

  it('ships a GitHub Actions workflow that builds, installs, exercises, and checksums the APK', () => {
    const workflow = fs.readFileSync(
      path.join(REPO_ROOT, '.github', 'workflows', 'mobile-pilot-android.yml'),
      'utf8',
    );
    expect(workflow).toContain('workflow_dispatch');
    expect(workflow).toContain('codex/mobile-pilot-mvp');
    expect(workflow).toContain(':app:assembleRelease');
    // Pilot ships one APK for real arm64 handsets plus the CI x86_64 emulator;
    // dropping the two legacy ABIs keeps the artifact under the 100 MB gate.
    expect(workflow).toContain('reactNativeArchitectures=arm64-v8a,x86_64');
    expect(workflow).toContain('reactivecircus/android-emulator-runner');
    expect(workflow).toContain('maestro');
    expect(workflow).toContain('logcat');
    expect(workflow).toContain('sha256');
    expect(workflow).toContain('ahd-pilot-v1.apk');
    expect(workflow).not.toContain('play-store');
  });

  it('describes the customer journey with stable automation identifiers that exist in the screens', () => {
    const journey = read('.maestro/pilot-journey.yaml');
    expect(journey).toContain('appId: sa.ahd.mobile');
    const requiredIds = [
      'welcome-start',
      'tab-create',
      'create-lender-input',
      'create-borrower-input',
      'create-amount-input',
      'create-agreement-date-input',
      'create-review-button',
      'create-seal-button',
      'create-open-daftari-button',
      'daftari-open-record',
      'record-open-proof',
      'proof-verdict',
    ];
    const screens = [
      read('src/app/(tabs)/_layout.tsx'),
      read('src/screens/WelcomeScreen.tsx'),
      read('src/screens/CreateAhdScreen.tsx'),
      read('src/screens/DaftariScreen.tsx'),
      read('src/screens/RecordDetailScreen.tsx'),
      read('src/screens/ProofScreen.tsx'),
    ].join('\n');
    for (const id of requiredIds) {
      expect(journey).toContain(id);
      expect(screens).toContain(id);
    }
  });

  it('ships emulator and performance scripts wired to the acceptance thresholds', () => {
    const emulatorScript = read('scripts/android-emulator-ci.sh');
    expect(emulatorScript).toContain('sa.ahd.mobile');
    expect(emulatorScript).toContain('am start -W');
    expect(emulatorScript).toContain('logcat');
    // Journey frame stats must be reset before and captured right after the
    // Maestro run — before any force-stop clears the in-process counters.
    const resetIndex = emulatorScript.indexOf('gfxinfo "$APP_ID" reset');
    const maestroIndex = emulatorScript.indexOf('maestro test');
    const captureIndex = emulatorScript.indexOf('gfxinfo "$APP_ID" >');
    const forceStopIndex = emulatorScript.indexOf('force-stop');
    expect(resetIndex).toBeGreaterThan(-1);
    expect(maestroIndex).toBeGreaterThan(resetIndex);
    expect(captureIndex).toBeGreaterThan(maestroIndex);
    expect(forceStopIndex).toBeGreaterThan(captureIndex);

    const perfScript = read('scripts/android-perf.mjs');
    expect(perfScript).toContain('2500');
    expect(perfScript).toContain('1000');
    expect(perfScript).toContain('300');
    expect(perfScript).toContain('FATAL EXCEPTION');
    expect(perfScript).toContain('ANR in');
  });
});
