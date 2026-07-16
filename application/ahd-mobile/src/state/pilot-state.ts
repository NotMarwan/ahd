import { ahdCore, type ProofPack, type SealedAhd } from '../core/ahd-core';
import { verifyAttachedProof } from '../share';
import type {
  AhdJourneyState,
  AhdStoredRecord,
  ImportedAhdRecord,
} from './journey-store';
import { initialJourneyState } from './journey-store';

export const PILOT_SLICE_KEYS = [
  'profile',
  'journey',
  'daily',
  'jamiya',
  'settings',
] as const;

export type PilotSliceKey = (typeof PILOT_SLICE_KEYS)[number];

export type PilotProfileSlice = {
  version: 1;
  welcomeAccepted: boolean;
  displayName: string | null;
};

export type PilotDailyEntry = {
  id: string;
  title: string;
  note: string;
  effectiveDate: string;
};

export type PilotDailySlice = {
  version: 1;
  entries: readonly PilotDailyEntry[];
};

export type PilotJamiyaMember = {
  id: string;
  displayName: string;
  consented: boolean;
  paidMinor: number;
};

export type PilotJamiyaSlice = {
  version: 1;
  circleId: string | null;
  title: string;
  contributionMinor: number;
  members: readonly PilotJamiyaMember[];
};

export type PilotSettingsSlice = {
  version: 1;
  digitMode: 'western' | 'arabic';
  hideAmounts: boolean;
};

export type PilotSlices = {
  profile: PilotProfileSlice;
  journey: AhdJourneyState;
  daily: PilotDailySlice;
  jamiya: PilotJamiyaSlice;
  settings: PilotSettingsSlice;
};

export type PilotSlice<K extends PilotSliceKey> = PilotSlices[K];

export function initialPilotSlices(): PilotSlices {
  return {
    profile: { version: 1, welcomeAccepted: false, displayName: null },
    journey: initialJourneyState(),
    daily: { version: 1, entries: [] },
    jamiya: {
      version: 1,
      circleId: null,
      title: '',
      contributionMinor: 0,
      members: [],
    },
    settings: { version: 1, digitMode: 'western', hideAmounts: false },
  };
}

type UnknownRecord = Record<string, unknown>;

const JOURNEY_STEPS = new Set([
  'home',
  'create',
  'riba_check',
  'sealed',
  'daftari',
  'record_detail',
  'settlement',
  'proof',
]);

function invalid(path: string): never {
  throw new Error(`Invalid Pilot data shape at ${path}`);
}

function stableJson(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === 'object') {
      return Object.keys(item as UnknownRecord)
        .sort()
        .reduce<UnknownRecord>((result, key) => {
          result[key] = normalize((item as UnknownRecord)[key]);
          return result;
        }, {});
    }
    return item;
  };
  return JSON.stringify(normalize(value));
}

function rebuildSealed(sealed: SealedAhd): SealedAhd {
  const source = sealed.prepared.sourceDraft;
  return ahdCore.sealPrepared(ahdCore.prepareDraft({
    id: source.id,
    lender: source.lender,
    borrower: source.borrower,
    amountMinor: source.amountMinor,
    months: source.months,
    open: source.open,
    start: source.start,
    timestamp: source.timestamp,
    purpose: source.purpose,
  }));
}

function sealedProofIntegrityAt(sealed: SealedAhd, proof: ProofPack, path: string): void {
  try {
    const recomputed = rebuildSealed(sealed);
    if (stableJson(recomputed) !== stableJson(sealed) || !verifyAttachedProof(sealed.record, proof).ok) {
      invalid(`${path}.integrity`);
    }
  } catch {
    invalid(`${path}.integrity`);
  }
}

function recordAt(
  value: unknown,
  path: string,
  required: readonly string[],
  optional: readonly string[] = [],
): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path);
  const record = value as UnknownRecord;
  const allowed = new Set([...required, ...optional]);
  if (required.some((key) => !Object.prototype.hasOwnProperty.call(record, key))) invalid(path);
  if (Object.keys(record).some((key) => !allowed.has(key))) invalid(path);
  return record;
}

function stringAt(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string') invalid(path);
}

function booleanAt(value: unknown, path: string): asserts value is boolean {
  if (typeof value !== 'boolean') invalid(path);
}

function integerAt(value: unknown, path: string, minimum = 0): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < minimum) invalid(path);
}

function stringOrNullAt(value: unknown, path: string): asserts value is string | null {
  if (value !== null && typeof value !== 'string') invalid(path);
}

function arrayAt(value: unknown, path: string): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) invalid(path);
}

function jsonValueAt(value: unknown, path: string): void {
  if (
    value === null
    || typeof value === 'string'
    || typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value))
  ) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => jsonValueAt(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value as UnknownRecord).forEach(([key, item]) => {
      jsonValueAt(item, `${path}.${key}`);
    });
    return;
  }
  invalid(path);
}

function draftAt(value: unknown, path: string): void {
  const draft = recordAt(value, path, [
    'id',
    'type',
    'lender',
    'borrower',
    'amountMinor',
    'open',
    'months',
    'start',
    'timestamp',
    'purpose',
  ]);
  stringAt(draft.id, `${path}.id`);
  stringAt(draft.type, `${path}.type`);
  stringAt(draft.lender, `${path}.lender`);
  stringAt(draft.borrower, `${path}.borrower`);
  integerAt(draft.amountMinor, `${path}.amountMinor`);
  booleanAt(draft.open, `${path}.open`);
  integerAt(draft.months, `${path}.months`);
  const start = recordAt(draft.start, `${path}.start`, ['y', 'm']);
  integerAt(start.y, `${path}.start.y`, 1);
  integerAt(start.m, `${path}.start.m`, 1);
  if ((start.m as number) > 12) invalid(`${path}.start.m`);
  stringAt(draft.timestamp, `${path}.timestamp`);
  stringAt(draft.purpose, `${path}.purpose`);
}

function screeningAt(value: unknown, path: string): void {
  const screening = recordAt(value, path, ['verdict', 'hits']);
  if (screening.verdict !== 'clean' && screening.verdict !== 'block') {
    invalid(`${path}.verdict`);
  }
  arrayAt(screening.hits, `${path}.hits`);
  screening.hits.forEach((item, index) => {
    const hitPath = `${path}.hits[${index}]`;
    const hit = recordAt(item, hitPath, ['why', 'fix', 'category'], ['severity', 'source']);
    stringAt(hit.why, `${hitPath}.why`);
    stringAt(hit.fix, `${hitPath}.fix`);
    stringAt(hit.category, `${hitPath}.category`);
    if (hit.severity !== undefined) stringAt(hit.severity, `${hitPath}.severity`);
    if (hit.source !== undefined) stringAt(hit.source, `${hitPath}.source`);
  });
}

function preparedAt(value: unknown, path: string): void {
  const prepared = recordAt(value, path, [
    'id',
    'lender',
    'borrower',
    'amountMinor',
    'open',
    'months',
    'termsAr',
    'schedule',
    'sourceDraft',
  ]);
  stringAt(prepared.id, `${path}.id`);
  stringAt(prepared.lender, `${path}.lender`);
  stringAt(prepared.borrower, `${path}.borrower`);
  integerAt(prepared.amountMinor, `${path}.amountMinor`);
  booleanAt(prepared.open, `${path}.open`);
  integerAt(prepared.months, `${path}.months`);
  stringAt(prepared.termsAr, `${path}.termsAr`);
  arrayAt(prepared.schedule, `${path}.schedule`);
  prepared.schedule.forEach((item, index) => {
    const itemPath = `${path}.schedule[${index}]`;
    const schedule = recordAt(item, itemPath, ['label', 'dueISO', 'amountMinor']);
    stringAt(schedule.label, `${itemPath}.label`);
    stringAt(schedule.dueISO, `${itemPath}.dueISO`);
    integerAt(schedule.amountMinor, `${itemPath}.amountMinor`);
  });
  draftAt(prepared.sourceDraft, `${path}.sourceDraft`);
}

function ahdRecordAt(value: unknown, path: string): void {
  const ahdRecord = recordAt(
    value,
    path,
    ['id', 'lender', 'borrower', 'amountMinor', 'installments', 'events'],
  );
  stringAt(ahdRecord.id, `${path}.id`);
  stringAt(ahdRecord.lender, `${path}.lender`);
  stringAt(ahdRecord.borrower, `${path}.borrower`);
  integerAt(ahdRecord.amountMinor, `${path}.amountMinor`);
  arrayAt(ahdRecord.installments, `${path}.installments`);
  ahdRecord.installments.forEach((item, index) => {
    const itemPath = `${path}.installments[${index}]`;
    const installment = recordAt(item, itemPath, ['dueISO', 'amountMinor']);
    stringOrNullAt(installment.dueISO, `${itemPath}.dueISO`);
    integerAt(installment.amountMinor, `${itemPath}.amountMinor`);
  });
  arrayAt(ahdRecord.events, `${path}.events`);
  ahdRecord.events.forEach((item, index) => {
    const itemPath = `${path}.events[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) invalid(itemPath);
    stringAt((item as UnknownRecord).type, `${itemPath}.type`);
    jsonValueAt(item, itemPath);
  });
}

function sealedAt(value: unknown, path: string): void {
  const sealed = recordAt(value, path, [
    'prepared',
    'termsAr',
    'screening',
    'canonical',
    'canonicalHash',
    'seal',
    'verification',
    'record',
  ]);
  preparedAt(sealed.prepared, `${path}.prepared`);
  stringAt(sealed.termsAr, `${path}.termsAr`);
  screeningAt(sealed.screening, `${path}.screening`);
  stringAt(sealed.canonical, `${path}.canonical`);
  stringAt(sealed.canonicalHash, `${path}.canonicalHash`);
  stringAt(sealed.seal, `${path}.seal`);

  const verification = recordAt(
    sealed.verification,
    `${path}.verification`,
    ['ok', 'sealed', 'recomputed', 'canonicalHash'],
  );
  booleanAt(verification.ok, `${path}.verification.ok`);
  stringAt(verification.sealed, `${path}.verification.sealed`);
  stringAt(verification.recomputed, `${path}.verification.recomputed`);
  stringAt(verification.canonicalHash, `${path}.verification.canonicalHash`);

  ahdRecordAt(sealed.record, `${path}.record`);
}

function transferAt(value: unknown, path: string): void {
  const transfer = recordAt(value, path, ['from', 'to', 'amountMinor']);
  stringAt(transfer.from, `${path}.from`);
  stringAt(transfer.to, `${path}.to`);
  integerAt(transfer.amountMinor, `${path}.amountMinor`);
}

function settlementAt(value: unknown, path: string): void {
  const settlement = recordAt(
    value,
    path,
    ['before', 'after', 'beforeCount', 'afterCount', 'conserved'],
  );
  arrayAt(settlement.before, `${path}.before`);
  arrayAt(settlement.after, `${path}.after`);
  settlement.before.forEach((item, index) => transferAt(item, `${path}.before[${index}]`));
  settlement.after.forEach((item, index) => transferAt(item, `${path}.after[${index}]`));
  integerAt(settlement.beforeCount, `${path}.beforeCount`);
  integerAt(settlement.afterCount, `${path}.afterCount`);
  booleanAt(settlement.conserved, `${path}.conserved`);
  if (settlement.beforeCount !== settlement.before.length) invalid(`${path}.beforeCount`);
  if (settlement.afterCount !== settlement.after.length) invalid(`${path}.afterCount`);
}

function proofAt(value: unknown, path: string): void {
  const proof = recordAt(value, path, ['id', 'canonical', 'contentHash', 'seal', 'chain']);
  stringAt(proof.id, `${path}.id`);
  stringAt(proof.canonical, `${path}.canonical`);
  stringAt(proof.contentHash, `${path}.contentHash`);
  stringAt(proof.seal, `${path}.seal`);
  arrayAt(proof.chain, `${path}.chain`);
  proof.chain.forEach((item, index) => {
    const itemPath = `${path}.chain[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) invalid(itemPath);
    jsonValueAt(item, itemPath);
  });
}

function storedRecordAt(value: unknown, path: string): void {
  const entry = recordAt(value, path, ['sealed', 'proof', 'source']);
  sealedAt(entry.sealed, `${path}.sealed`);
  proofAt(entry.proof, `${path}.proof`);
  if (entry.source !== 'local' && entry.source !== 'imported') invalid(`${path}.source`);
  const sealed = entry.sealed as { record: { id: string } };
  const proof = entry.proof as { id: string };
  if (sealed.record.id !== proof.id) invalid(`${path}.proof.id`);
  const typed = entry as unknown as AhdStoredRecord;
  sealedProofIntegrityAt(typed.sealed, typed.proof, path);
}

function importedRecordAt(value: unknown, path: string): void {
  const entry = recordAt(value, path, ['record', 'proof', 'exportedAt']);
  ahdRecordAt(entry.record, `${path}.record`);
  proofAt(entry.proof, `${path}.proof`);
  stringAt(entry.exportedAt, `${path}.exportedAt`);
  const record = entry.record as { id: string };
  const proof = entry.proof as { id: string };
  if (record.id !== proof.id) invalid(`${path}.proof.id`);
  try {
    const typed = entry as unknown as ImportedAhdRecord;
    if (!verifyAttachedProof(typed.record, typed.proof).ok) invalid(`${path}.integrity`);
  } catch {
    invalid(`${path}.integrity`);
  }
}

function journeyAt(value: unknown, path: string): void {
  const journey = recordAt(
    value,
    path,
    ['version', 'asOf', 'step'],
    [
      'records',
      'imports',
      'activeRecordId',
      'prepared',
      'screening',
      'sealed',
      'settlement',
      'settlementConsent',
      'proof',
      'proofVerification',
      'connection',
    ],
  );
  if (journey.version !== 1) invalid(`${path}.version`);
  if (journey.asOf !== initialJourneyState().asOf) invalid(`${path}.asOf`);
  if (typeof journey.step !== 'string' || !JOURNEY_STEPS.has(journey.step)) {
    invalid(`${path}.step`);
  }
  const hasRecords = Object.prototype.hasOwnProperty.call(journey, 'records');
  const hasImports = Object.prototype.hasOwnProperty.call(journey, 'imports');
  const hasActiveRecordId = Object.prototype.hasOwnProperty.call(journey, 'activeRecordId');
  if (hasRecords !== hasActiveRecordId) invalid(`${path}.records`);
  if (hasRecords) {
    arrayAt(journey.records, `${path}.records`);
    journey.records.forEach((entry, index) => storedRecordAt(entry, `${path}.records[${index}]`));
    stringOrNullAt(journey.activeRecordId, `${path}.activeRecordId`);
    const ids = journey.records.map((entry) => (
      entry as { sealed: { record: { id: string } } }
    ).sealed.record.id);
    if (new Set(ids).size !== ids.length) invalid(`${path}.records`);
    if (journey.activeRecordId !== null && !ids.includes(journey.activeRecordId as string)) {
      invalid(`${path}.activeRecordId`);
    }
  }
  if (hasImports) {
    arrayAt(journey.imports, `${path}.imports`);
    journey.imports.forEach((entry, index) => importedRecordAt(entry, `${path}.imports[${index}]`));
    const importedIds = journey.imports.map((entry) => (
      entry as { record: { id: string } }
    ).record.id);
    if (new Set(importedIds).size !== importedIds.length) invalid(`${path}.imports`);
  }
  if (journey.prepared !== undefined) preparedAt(journey.prepared, `${path}.prepared`);
  if (journey.screening !== undefined) screeningAt(journey.screening, `${path}.screening`);
  if (journey.sealed !== undefined) sealedAt(journey.sealed, `${path}.sealed`);
  if (journey.settlement !== undefined) settlementAt(journey.settlement, `${path}.settlement`);
  if (journey.settlementConsent !== undefined) {
    const consent = recordAt(
      journey.settlementConsent,
      `${path}.settlementConsent`,
      ['confirmed', 'recordIds'],
    );
    if (consent.confirmed !== true) invalid(`${path}.settlementConsent.confirmed`);
    arrayAt(consent.recordIds, `${path}.settlementConsent.recordIds`);
    consent.recordIds.forEach((recordId, index) => (
      stringAt(recordId, `${path}.settlementConsent.recordIds[${index}]`)
    ));
    if (consent.recordIds.length === 0) invalid(`${path}.settlementConsent.recordIds`);
    if (new Set(consent.recordIds as readonly string[]).size !== consent.recordIds.length) {
      invalid(`${path}.settlementConsent.recordIds`);
    }
  }
  if (Boolean(journey.settlement) !== Boolean(journey.settlementConsent)) {
    invalid(`${path}.settlement.integrity`);
  }
  if (journey.settlement !== undefined && journey.settlementConsent !== undefined) {
    if (!hasRecords) invalid(`${path}.settlement.integrity`);
    try {
      const consent = journey.settlementConsent as { confirmed: true; recordIds: readonly string[] };
      const records = journey.records as readonly AhdStoredRecord[];
      const entries = consent.recordIds.map((recordId) => {
        const entry = records.find((candidate) => candidate.sealed.record.id === recordId);
        if (!entry || entry.source !== 'local') invalid(`${path}.settlement.integrity`);
        return entry;
      });
      const recomputed = ahdCore.buildSettlement(entries.map(({ sealed }) => ({
        from: sealed.record.borrower,
        to: sealed.record.lender,
        amountMinor: sealed.record.amountMinor,
      })));
      if (stableJson(recomputed) !== stableJson(journey.settlement)) {
        invalid(`${path}.settlement.integrity`);
      }
    } catch {
      invalid(`${path}.settlement.integrity`);
    }
  }
  if (journey.proof !== undefined) proofAt(journey.proof, `${path}.proof`);
  if (journey.proofVerification !== undefined) {
    const verification = recordAt(
      journey.proofVerification,
      `${path}.proofVerification`,
      ['ok', 'sealed', 'recomputed', 'contentHash'],
    );
    booleanAt(verification.ok, `${path}.proofVerification.ok`);
    stringAt(verification.sealed, `${path}.proofVerification.sealed`);
    stringAt(verification.recomputed, `${path}.proofVerification.recomputed`);
    stringAt(verification.contentHash, `${path}.proofVerification.contentHash`);
  }
  if (journey.connection !== undefined) {
    const connection = recordAt(
      journey.connection,
      `${path}.connection`,
      ['status', 'operation', 'recordId'],
    );
    if (connection.status !== 'needs_connection') invalid(`${path}.connection.status`);
    if (connection.operation !== 'identity' && connection.operation !== 'external_evidence') {
      invalid(`${path}.connection.operation`);
    }
    stringAt(connection.recordId, `${path}.connection.recordId`);
  }

  const step = journey.step as string;
  if (step === 'riba_check' && (!journey.prepared || !journey.screening)) invalid(`${path}.step`);
  if (['sealed', 'daftari', 'record_detail'].includes(step) && !journey.sealed) {
    invalid(`${path}.step`);
  }
  if (step === 'settlement' && (!journey.sealed || !journey.settlement)) invalid(`${path}.step`);
  if (step === 'proof' && (!journey.sealed || !journey.proof || !journey.proofVerification)) {
    invalid(`${path}.step`);
  }
  if (hasRecords && journey.sealed) {
    const sealedId = (journey.sealed as { record: { id: string } }).record.id;
    if (journey.activeRecordId !== sealedId) invalid(`${path}.activeRecordId`);
    const activeEntry = (journey.records as readonly unknown[]).find((entry) => (
      (entry as AhdStoredRecord).sealed.record.id === sealedId
    )) as AhdStoredRecord | undefined;
    if (!activeEntry || stableJson(activeEntry.sealed) !== stableJson(journey.sealed)) {
      invalid(`${path}.sealed.integrity`);
    }
    if (journey.proof !== undefined) {
      const rootProof = journey.proof as ProofPack;
      if (!verifyAttachedProof(activeEntry.sealed.record, rootProof).ok) {
        invalid(`${path}.proof.integrity`);
      }
      if (journey.proofVerification !== undefined) {
        const expected = verifyAttachedProof(activeEntry.sealed.record, rootProof);
        if (stableJson(expected) !== stableJson(journey.proofVerification)) {
          invalid(`${path}.proofVerification`);
        }
      }
    }
  }
}

export function assertPilotSlice<K extends PilotSliceKey>(
  key: K,
  value: unknown,
): asserts value is PilotSlice<K> {
  if (key === 'profile') {
    const profile = recordAt(value, 'profile', ['version', 'welcomeAccepted', 'displayName']);
    if (profile.version !== 1) invalid('profile.version');
    booleanAt(profile.welcomeAccepted, 'profile.welcomeAccepted');
    stringOrNullAt(profile.displayName, 'profile.displayName');
    return;
  }
  if (key === 'journey') {
    journeyAt(value, 'journey');
    return;
  }
  if (key === 'daily') {
    const daily = recordAt(value, 'daily', ['version', 'entries']);
    if (daily.version !== 1) invalid('daily.version');
    arrayAt(daily.entries, 'daily.entries');
    daily.entries.forEach((item, index) => {
      const path = `daily.entries[${index}]`;
      const entry = recordAt(item, path, ['id', 'title', 'note', 'effectiveDate']);
      stringAt(entry.id, `${path}.id`);
      stringAt(entry.title, `${path}.title`);
      stringAt(entry.note, `${path}.note`);
      stringAt(entry.effectiveDate, `${path}.effectiveDate`);
    });
    return;
  }
  if (key === 'jamiya') {
    const jamiya = recordAt(
      value,
      'jamiya',
      ['version', 'circleId', 'title', 'contributionMinor', 'members'],
    );
    if (jamiya.version !== 1) invalid('jamiya.version');
    stringOrNullAt(jamiya.circleId, 'jamiya.circleId');
    stringAt(jamiya.title, 'jamiya.title');
    integerAt(jamiya.contributionMinor, 'jamiya.contributionMinor');
    arrayAt(jamiya.members, 'jamiya.members');
    jamiya.members.forEach((item, index) => {
      const path = `jamiya.members[${index}]`;
      const member = recordAt(item, path, ['id', 'displayName', 'consented', 'paidMinor']);
      stringAt(member.id, `${path}.id`);
      stringAt(member.displayName, `${path}.displayName`);
      booleanAt(member.consented, `${path}.consented`);
      integerAt(member.paidMinor, `${path}.paidMinor`);
    });
    return;
  }
  const settings = recordAt(value, 'settings', ['version', 'digitMode', 'hideAmounts']);
  if (settings.version !== 1) invalid('settings.version');
  if (settings.digitMode !== 'western' && settings.digitMode !== 'arabic') {
    invalid('settings.digitMode');
  }
  booleanAt(settings.hideAmounts, 'settings.hideAmounts');
}

export function assertPilotSlices(value: unknown): asserts value is PilotSlices {
  const slices = recordAt(value, 'slices', PILOT_SLICE_KEYS);
  PILOT_SLICE_KEYS.forEach((key) => assertPilotSlice(key, slices[key]));
}
