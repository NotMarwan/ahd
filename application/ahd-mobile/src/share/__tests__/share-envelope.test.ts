import { describe, expect, test } from '@jest/globals';

import { ahdCore } from '@/core/ahd-core';
import {
  createShareEnvelope,
  parseShareEnvelope,
  serializeShareEnvelope,
  verifyAttachedProof,
} from '../share-envelope';

function fixture() {
  const sealed = ahdCore.sealPrepared(ahdCore.prepareDraft({
    id: 'AHD-SHARE-0001',
    lender: 'سارة',
    borrower: 'أحمد',
    amountMinor: 800_000,
    months: 4,
    start: { y: 2026, m: 7 },
    timestamp: '2026-07-16T16:00:00+03:00',
  }));
  const proof = ahdCore.buildProof(sealed.record);
  return { sealed, proof };
}

describe('ShareEnvelopeV1', () => {
  test('serializes deterministically and verifies a round trip', () => {
    const { sealed, proof } = fixture();
    const envelope = createShareEnvelope({
      record: sealed.record,
      proof,
      exportedAt: sealed.prepared.sourceDraft.timestamp,
    });

    const first = serializeShareEnvelope(envelope);
    const second = serializeShareEnvelope(envelope);
    const result = parseShareEnvelope(first);

    expect(first).toBe(second);
    expect(result.status).toBe('verified');
    if (result.status === 'verified') {
      expect(result.record).toMatchObject({
        id: sealed.record.id,
        lender: sealed.record.lender,
        borrower: sealed.record.borrower,
        amountMinor: sealed.record.amountMinor,
        installments: sealed.record.installments,
      });
      expect(result.record.events.map((event) => event.type)).toEqual(
        sealed.record.events.map((event) => event.type),
      );
      expect(result.envelope.format).toBe('ShareEnvelopeV1');
    }
  });

  test('detects amount, seal, and chain tampering against the attached proof', () => {
    const { sealed, proof } = fixture();
    const envelope = createShareEnvelope({
      record: sealed.record,
      proof,
      exportedAt: sealed.prepared.sourceDraft.timestamp,
    });

    const amount = structuredClone(envelope);
    amount.record.amount_minor += 1;
    expect(parseShareEnvelope(JSON.stringify(amount)).status).toBe('tampered');

    const seal = structuredClone(envelope);
    seal.proof.seal = `${'0'.repeat(63)}1`;
    expect(parseShareEnvelope(JSON.stringify(seal)).status).toBe('tampered');

    const chain = structuredClone(envelope);
    chain.proof.chain[1].prev = `${'f'.repeat(64)}`;
    expect(parseShareEnvelope(JSON.stringify(chain)).status).toBe('tampered');
  });

  test('separates unsupported and invalid data without accepting extra keys', () => {
    const { sealed, proof } = fixture();
    const envelope = createShareEnvelope({
      record: sealed.record,
      proof,
      exportedAt: sealed.prepared.sourceDraft.timestamp,
    });

    expect(parseShareEnvelope(JSON.stringify({ ...envelope, version: 2 })).status).toBe('unsupported');
    expect(parseShareEnvelope(JSON.stringify({ ...envelope, surprise: true })).status).toBe('invalid');
    expect(parseShareEnvelope('{not-json').status).toBe('invalid');
    expect(parseShareEnvelope('x'.repeat(65 * 1024)).status).toBe('invalid');
  });

  test('rejects canonical control characters and compares every proof field', () => {
    const { sealed, proof } = fixture();
    expect(() => createShareEnvelope({
      record: { ...sealed.record, lender: 'سارة\nأخرى' },
      proof,
      exportedAt: sealed.prepared.sourceDraft.timestamp,
    })).toThrow('control characters');

    expect(verifyAttachedProof(sealed.record, { ...proof, canonical: `${proof.canonical}x` }).ok).toBe(false);
  });
});
