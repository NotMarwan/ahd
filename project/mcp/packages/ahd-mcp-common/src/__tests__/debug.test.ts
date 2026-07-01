import { test } from 'node:test';
import assert from 'node:assert';
import { debugLog } from '../debug.js';

function withCapturedStderr(fn: () => void): string[] {
  const chunks: string[] = [];
  const originalWrite = process.stderr.write.bind(process.stderr);
  (process.stderr.write as unknown) = (chunk: unknown) => {
    chunks.push(String(chunk));
    return true;
  };
  try {
    fn();
  } finally {
    process.stderr.write = originalWrite;
  }
  return chunks;
}

test('debugLog writes a scoped message to stderr when DEBUG is set', () => {
  const original = process.env.DEBUG;
  process.env.DEBUG = '1';
  let chunks: string[];
  try {
    chunks = withCapturedStderr(() => debugLog('my-scope', 'hello world'));
  } finally {
    if (original === undefined) delete process.env.DEBUG;
    else process.env.DEBUG = original;
  }
  assert.ok(chunks.some(c => c.includes('my-scope') && c.includes('hello world')));
});

test('debugLog is silent when DEBUG is unset', () => {
  const original = process.env.DEBUG;
  delete process.env.DEBUG;
  let chunks: string[];
  try {
    chunks = withCapturedStderr(() => debugLog('my-scope', 'should not appear'));
  } finally {
    if (original === undefined) delete process.env.DEBUG;
    else process.env.DEBUG = original;
  }
  assert.equal(chunks.length, 0);
});
