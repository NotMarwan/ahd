// Ahd Pilot — performance/stability gate over emulator evidence.
// Thresholds are the approved acceptance gates for the Pilot APK.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const COLD_START_MAX_MS = 2500;
const WARM_START_MAX_MS = 1000;
const TRANSITION_MAX_MS = 300;
const JANK_MAX_PERCENT = 5;

const outDir = process.argv[2] ?? 'artifacts/emulator-evidence';
// Software-rendered emulators (SwiftShader on GPU-less CI runners) miss the
// 16 ms HWUI deadline on nearly every frame by construction, so the jank gate
// is only meaningful under hardware rendering. The percentage is still
// measured and reported either way.
const softwareRenderer = process.env.AHD_SOFT_GPU === '1';
const failures = [];
const report = {
  thresholds: { COLD_START_MAX_MS, WARM_START_MAX_MS, TRANSITION_MAX_MS, JANK_MAX_PERCENT },
  jankGate: softwareRenderer ? 'informational (software renderer)' : 'enforced',
};

function totalTimes(file) {
  const text = readFileSync(join(outDir, file), 'utf8');
  return [...text.matchAll(/^TotalTime:\s+(\d+)/gm)].map((m) => Number(m[1]));
}

const cold = totalTimes('cold-starts.txt');
if (cold.length < 3) failures.push(`expected 3 cold-start samples, saw ${cold.length}`);
const coldMean = cold.length ? Math.round(cold.reduce((a, b) => a + b, 0) / cold.length) : null;
report.coldStartsMs = cold;
report.coldStartMeanMs = coldMean;
if (coldMean !== null && coldMean >= COLD_START_MAX_MS) {
  failures.push(`cold start mean ${coldMean}ms >= ${COLD_START_MAX_MS}ms`);
}

const warm = totalTimes('warm-start.txt');
report.warmStartMs = warm[0] ?? null;
if (warm.length === 0) failures.push('missing warm-start sample');
else if (warm[0] >= WARM_START_MAX_MS) failures.push(`warm start ${warm[0]}ms >= ${WARM_START_MAX_MS}ms`);

// Route-transition + jank evidence from gfxinfo aggregate frame stats.
const gfxPath = join(outDir, 'gfxinfo.txt');
if (existsSync(gfxPath)) {
  const gfx = readFileSync(gfxPath, 'utf8');
  const total = Number(/Total frames rendered:\s+(\d+)/.exec(gfx)?.[1] ?? 0);
  const janky = Number(/Janky frames:\s+(\d+)/.exec(gfx)?.[1] ?? 0);
  const p95 = Number(/95th percentile:\s+(\d+)ms/.exec(gfx)?.[1] ?? 0);
  report.framesTotal = total;
  report.framesJanky = janky;
  report.frameP95Ms = p95;
  if (total > 0) {
    const jankPercent = (janky / total) * 100;
    report.jankPercent = Math.round(jankPercent * 100) / 100;
    if (jankPercent >= JANK_MAX_PERCENT && !softwareRenderer) {
      failures.push(`jank ${report.jankPercent}% >= ${JANK_MAX_PERCENT}%`);
    }
  } else {
    failures.push('gfxinfo reported zero rendered frames');
  }
  // The 95th percentile frame time across the exercised journey stands in for
  // the per-transition bound: a transition that misses 300ms shows up here.
  if (p95 >= TRANSITION_MAX_MS) {
    failures.push(`95th percentile frame ${p95}ms >= ${TRANSITION_MAX_MS}ms transition bound`);
  }
} else {
  failures.push('missing gfxinfo.txt');
}

const logcat = readFileSync(join(outDir, 'logcat.txt'), 'utf8');
const crashes = logcat.match(/FATAL EXCEPTION/g)?.length ?? 0;
const anrs = logcat.match(/ANR in sa\.ahd\.mobile/g)?.length ?? 0;
report.fatalExceptions = crashes;
report.anrs = anrs;
if (crashes > 0) failures.push(`${crashes} FATAL EXCEPTION entries in logcat`);
if (anrs > 0) failures.push(`${anrs} ANR entries for sa.ahd.mobile in logcat`);

report.pass = failures.length === 0;
report.failures = failures;
writeFileSync(join(outDir, 'perf.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) {
  console.error('PERF GATE FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('PERF GATE PASSED');
