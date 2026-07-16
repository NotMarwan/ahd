import {
  ahdCore,
  type AhdRecord,
  type ProofPack,
  type ProofVerification,
} from '@/core/ahd-core';

const MAX_ENVELOPE_BYTES = 64 * 1024;
const HEX_64 = /^[0-9a-f]{64}$/;
const EVENT_TYPE = /^[A-Z][A-Z0-9_]{0,63}$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export type ShareEnvelopeV1 = {
  format: 'ShareEnvelopeV1';
  version: 1;
  record: {
    id: string;
    lender: string;
    borrower: string;
    amount_minor: number;
    installments: Array<{ due_iso: string | null; amount_minor: number }>;
    event_types: string[];
  };
  proof: {
    id: string;
    canonical: string;
    content_hash: string;
    seal: string;
    chain: [
      { label: 'genesis'; hash: string },
      {
        label: 'block';
        seq: 1;
        prev: string;
        content_hash: string;
        seal: string;
      },
    ];
  };
  exported_at: string;
};

export type ShareEnvelopeResult =
  | {
      status: 'verified' | 'tampered';
      envelope: ShareEnvelopeV1;
      record: AhdRecord;
      proof: ProofPack;
      verification: ProofVerification;
    }
  | { status: 'unsupported'; reason: string }
  | { status: 'invalid'; reason: string };

export type CreateShareEnvelopeInput = {
  record: AhdRecord;
  proof: ProofPack;
  exportedAt: string;
};

class InvalidEnvelopeError extends Error {}

function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    bytes += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
  }
  return bytes;
}

function objectAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidEnvelopeError(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[], path: string): void {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new InvalidEnvelopeError(`${path} contains unexpected or missing keys`);
  }
}

function stringAt(value: unknown, path: string, maxLength: number): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > maxLength) {
    throw new InvalidEnvelopeError(`${path} must be a non-empty string`);
  }
  return value;
}

function canonicalFieldAt(value: unknown, path: string, maxLength: number): string {
  const field = stringAt(value, path, maxLength);
  if (CONTROL_CHARACTERS.test(field)) {
    throw new InvalidEnvelopeError(`${path} contains invalid control characters`);
  }
  return field;
}

function safeMinorAt(value: unknown, path: string, allowZero = false): number {
  if (!Number.isSafeInteger(value) || (value as number) < (allowZero ? 0 : 1)) {
    throw new InvalidEnvelopeError(`${path} must be integer halalas`);
  }
  return value as number;
}

function hexAt(value: unknown, path: string): string {
  const text = stringAt(value, path, 64);
  if (!HEX_64.test(text)) throw new InvalidEnvelopeError(`${path} must be a SHA-256 hex value`);
  return text;
}

function recordFromWire(value: unknown): AhdRecord {
  const record = objectAt(value, 'record');
  exactKeys(record, ['id', 'lender', 'borrower', 'amount_minor', 'installments', 'event_types'], 'record');
  const id = canonicalFieldAt(record.id, 'record.id', 64);
  const lender = canonicalFieldAt(record.lender, 'record.lender', 80);
  const borrower = canonicalFieldAt(record.borrower, 'record.borrower', 80);
  if (lender === borrower) throw new InvalidEnvelopeError('record parties must be distinct');
  const amountMinor = safeMinorAt(record.amount_minor, 'record.amount_minor');
  if (!Array.isArray(record.installments) || record.installments.length === 0 || record.installments.length > 120) {
    throw new InvalidEnvelopeError('record.installments must contain 1 to 120 entries');
  }
  const installments = record.installments.map((item, index) => {
    const installment = objectAt(item, `record.installments[${index}]`);
    exactKeys(installment, ['due_iso', 'amount_minor'], `record.installments[${index}]`);
    const dueISO = installment.due_iso;
    if (dueISO !== null && (typeof dueISO !== 'string' || !DATE_ONLY.test(dueISO))) {
      throw new InvalidEnvelopeError(`record.installments[${index}].due_iso is invalid`);
    }
    return {
      dueISO,
      amountMinor: safeMinorAt(installment.amount_minor, `record.installments[${index}].amount_minor`),
    };
  });
  if (!Array.isArray(record.event_types) || record.event_types.length > 256) {
    throw new InvalidEnvelopeError('record.event_types is invalid');
  }
  const events = record.event_types.map((event, index) => {
    if (typeof event !== 'string' || !EVENT_TYPE.test(event)) {
      throw new InvalidEnvelopeError(`record.event_types[${index}] is invalid`);
    }
    return { type: event };
  });
  return { id, lender, borrower, amountMinor, installments, events };
}

function proofFromWire(value: unknown): ProofPack {
  const proof = objectAt(value, 'proof');
  exactKeys(proof, ['id', 'canonical', 'content_hash', 'seal', 'chain'], 'proof');
  const id = canonicalFieldAt(proof.id, 'proof.id', 64);
  const canonical = stringAt(proof.canonical, 'proof.canonical', 32 * 1024);
  const contentHash = hexAt(proof.content_hash, 'proof.content_hash');
  const seal = hexAt(proof.seal, 'proof.seal');
  if (!Array.isArray(proof.chain) || proof.chain.length !== 2) {
    throw new InvalidEnvelopeError('proof.chain must contain exactly two entries');
  }
  const genesis = objectAt(proof.chain[0], 'proof.chain[0]');
  exactKeys(genesis, ['label', 'hash'], 'proof.chain[0]');
  if (genesis.label !== 'genesis') throw new InvalidEnvelopeError('proof.chain[0].label is invalid');
  const genesisHash = hexAt(genesis.hash, 'proof.chain[0].hash');
  const block = objectAt(proof.chain[1], 'proof.chain[1]');
  exactKeys(block, ['label', 'seq', 'prev', 'content_hash', 'seal'], 'proof.chain[1]');
  if (block.label !== 'block' || block.seq !== 1) {
    throw new InvalidEnvelopeError('proof.chain[1] is invalid');
  }
  return {
    id,
    canonical,
    contentHash,
    seal,
    chain: [
      { label: 'genesis', hash: genesisHash },
      {
        label: 'block',
        seq: 1,
        prev: hexAt(block.prev, 'proof.chain[1].prev'),
        contentHash: hexAt(block.content_hash, 'proof.chain[1].content_hash'),
        seal: hexAt(block.seal, 'proof.chain[1].seal'),
      },
    ],
  };
}

function chainMatches(expected: ProofPack, attached: ProofPack): boolean {
  if (expected.chain.length !== 2 || attached.chain.length !== 2) return false;
  const expectedGenesis = expected.chain[0];
  const attachedGenesis = attached.chain[0];
  const expectedBlock = expected.chain[1];
  const attachedBlock = attached.chain[1];
  return expectedGenesis.label === attachedGenesis.label
    && expectedGenesis.hash === attachedGenesis.hash
    && expectedBlock.label === attachedBlock.label
    && expectedBlock.seq === attachedBlock.seq
    && expectedBlock.prev === attachedBlock.prev
    && expectedBlock.contentHash === attachedBlock.contentHash
    && expectedBlock.seal === attachedBlock.seal;
}

export function verifyAttachedProof(record: AhdRecord, attached: ProofPack): ProofVerification {
  const expected = ahdCore.buildProof(record);
  const ok = expected.id === attached.id
    && expected.canonical === attached.canonical
    && expected.contentHash === attached.contentHash
    && expected.seal === attached.seal
    && chainMatches(expected, attached);
  return {
    ok,
    sealed: attached.seal,
    recomputed: expected.seal,
    contentHash: expected.contentHash,
  };
}

function wireRecord(record: AhdRecord): ShareEnvelopeV1['record'] {
  return {
    id: record.id,
    lender: record.lender,
    borrower: record.borrower,
    amount_minor: record.amountMinor,
    installments: record.installments.map((item) => ({
      due_iso: item.dueISO,
      amount_minor: item.amountMinor,
    })),
    event_types: record.events.map((event) => event.type),
  };
}

function wireProof(proof: ProofPack): ShareEnvelopeV1['proof'] {
  const genesis = proof.chain[0];
  const block = proof.chain[1];
  return {
    id: proof.id,
    canonical: proof.canonical,
    content_hash: proof.contentHash,
    seal: proof.seal,
    chain: [
      { label: 'genesis', hash: String(genesis?.hash ?? '') },
      {
        label: 'block',
        seq: 1,
        prev: String(block?.prev ?? ''),
        content_hash: String(block?.contentHash ?? ''),
        seal: String(block?.seal ?? ''),
      },
    ],
  };
}

export function createShareEnvelope(input: CreateShareEnvelopeInput): ShareEnvelopeV1 {
  const record = recordFromWire(wireRecord(input.record));
  const proof = proofFromWire(wireProof(input.proof));
  if (!verifyAttachedProof(record, proof).ok) throw new InvalidEnvelopeError('proof does not match record');
  if (!ISO_WITH_OFFSET.test(input.exportedAt) || Number.isNaN(Date.parse(input.exportedAt))) {
    throw new InvalidEnvelopeError('exported_at must be an ISO timestamp with an offset');
  }
  return {
    format: 'ShareEnvelopeV1',
    version: 1,
    record: wireRecord(record),
    proof: wireProof(proof),
    exported_at: input.exportedAt,
  };
}

export function serializeShareEnvelope(envelope: ShareEnvelopeV1): string {
  const serialized = JSON.stringify(envelope);
  const parsed = parseShareEnvelope(serialized);
  if (parsed.status !== 'verified') throw new InvalidEnvelopeError('only verified envelopes can be shared');
  return serialized;
}

export function parseShareEnvelope(serialized: string): ShareEnvelopeResult {
  if (typeof serialized !== 'string' || utf8ByteLength(serialized) > MAX_ENVELOPE_BYTES) {
    return { status: 'invalid', reason: 'Envelope exceeds the 64 KiB limit' };
  }
  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    return { status: 'invalid', reason: 'Envelope is not valid JSON' };
  }
  try {
    const top = objectAt(value, 'envelope');
    if (top.format !== 'ShareEnvelopeV1' || top.version !== 1) {
      return { status: 'unsupported', reason: 'Unsupported share envelope version' };
    }
    exactKeys(top, ['format', 'version', 'record', 'proof', 'exported_at'], 'envelope');
    const exportedAt = stringAt(top.exported_at, 'exported_at', 64);
    if (!ISO_WITH_OFFSET.test(exportedAt) || Number.isNaN(Date.parse(exportedAt))) {
      throw new InvalidEnvelopeError('exported_at is invalid');
    }
    const record = recordFromWire(top.record);
    const proof = proofFromWire(top.proof);
    if (record.id !== proof.id) throw new InvalidEnvelopeError('record and proof identifiers differ');
    const envelope = top as ShareEnvelopeV1;
    const verification = verifyAttachedProof(record, proof);
    return {
      status: verification.ok ? 'verified' : 'tampered',
      envelope,
      record,
      proof,
      verification,
    };
  } catch (error) {
    return {
      status: 'invalid',
      reason: error instanceof Error ? error.message : 'Envelope validation failed',
    };
  }
}
