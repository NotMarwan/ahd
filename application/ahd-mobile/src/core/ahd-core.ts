/* eslint-disable @typescript-eslint/no-require-imports */

const engine = require("../generated/engine.js") as GeneratedEngine;
const createFeature = require("../generated/features/create.js") as GeneratedCreate;
const settlementFeature = require("../generated/features/settlement.js") as GeneratedSettlement;
const proofFeature = require("../generated/features/proof.js") as GeneratedProof;

export const AS_OF = "2026-06-21" as const;

export type RibaVerdict = "clean" | "block";

export interface RibaHit {
  why: string;
  fix: string;
  category: string;
  severity?: string;
  source?: string;
}

export interface RibaScreening {
  verdict: RibaVerdict;
  hits: RibaHit[];
}

export interface AhdDraftInput {
  id: string;
  lender: string;
  borrower: string;
  amountMinor: number;
  months?: number;
  open?: boolean;
  start?: { y: number; m: number };
  timestamp?: string;
  purpose?: string;
}

export interface AhdScheduleItem {
  label: string;
  dueISO: string;
  amountMinor: number;
}

export interface PreparedAhd {
  id: string;
  lender: string;
  borrower: string;
  amountMinor: number;
  open: boolean;
  months: number;
  termsAr: string;
  schedule: AhdScheduleItem[];
  sourceDraft: GeneratedDraft;
}

export interface AhdEvent {
  type: string;
  [key: string]: unknown;
}

export interface AhdRecord {
  id: string;
  lender: string;
  borrower: string;
  amountMinor: number;
  installments: Array<{ dueISO: string | null; amountMinor: number }>;
  events: AhdEvent[];
}

export interface SealVerification {
  ok: boolean;
  sealed: string;
  recomputed: string;
  canonicalHash: string;
}

export interface SealedAhd {
  prepared: PreparedAhd;
  termsAr: string;
  screening: RibaScreening;
  canonical: string;
  canonicalHash: string;
  seal: string;
  verification: SealVerification;
  record: AhdRecord;
}

export interface ProofPack {
  id: string;
  canonical: string;
  contentHash: string;
  seal: string;
  chain: Array<Record<string, unknown>>;
}

export interface ProofVerification {
  ok: boolean;
  sealed: string;
  recomputed: string;
  contentHash: string;
}

export interface SettlementTransfer {
  from: string;
  to: string;
  amountMinor: number;
}

export interface SettlementResult {
  before: SettlementTransfer[];
  after: SettlementTransfer[];
  beforeCount: number;
  afterCount: number;
  conserved: boolean;
}

export interface NeedsConnection {
  status: "needs_connection";
  operation: "identity" | "external_evidence";
  recordId: string;
}

export class RibaBlockedError extends Error {
  readonly screening: RibaScreening;

  constructor(screening: RibaScreening) {
    super("Riba screening blocked sealing");
    this.name = "RibaBlockedError";
    this.screening = screening;
  }
}

function normalizeSarDigits(value: string): string {
  let normalized = "";
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) {
      normalized += String.fromCharCode(0x30 + code - 0x0660);
    } else if (code >= 0x06f0 && code <= 0x06f9) {
      normalized += String.fromCharCode(0x30 + code - 0x06f0);
    } else {
      normalized += character === "٫" ? "." : character;
    }
  }
  return normalized;
}

function integerDigits(value: string): number {
  let result = 0;
  for (const character of value) {
    result = result * 10 + character.charCodeAt(0) - 0x30;
    if (!Number.isSafeInteger(result)) throw new TypeError("Amount must be a valid SAR amount");
  }
  return result;
}

export function parseSarTextToMinor(value: string): number {
  const normalized = normalizeSarDigits(value.trim());
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new TypeError("Amount must be a valid SAR amount with up to two decimal places");
  }

  const [wholeDigits, fractionDigits = ""] = normalized.split(".");
  const whole = integerDigits(wholeDigits);
  const fraction = fractionDigits.length === 0
    ? 0
    : integerDigits(fractionDigits) * (fractionDigits.length === 1 ? 10 : 1);
  const amountMinor = whole * 100 + fraction;
  if (!Number.isSafeInteger(amountMinor)) {
    throw new TypeError("Amount must be a valid SAR amount");
  }
  return amountMinor;
}

export function formatMinorSar(amountMinor: number): string {
  assertMinor(amountMinor);
  const fraction = amountMinor % 100;
  const whole = (amountMinor - fraction) / 100;
  const groupedWhole = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${groupedWhole}.${String(fraction).padStart(2, "0")} ر.س`;
}

function assertMinor(value: number, label = "amountMinor"): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${label} must be non-negative integer halalas`);
  }
}

function minorToGeneratedSar(amountMinor: number): number {
  assertMinor(amountMinor);
  return amountMinor / 100;
}

function generatedRecord(record: AhdRecord): GeneratedRecord {
  assertMinor(record.amountMinor);
  return {
    id: record.id,
    lender: record.lender,
    borrower: record.borrower,
    amountSAR: minorToGeneratedSar(record.amountMinor),
    installments: record.installments.map((item) => {
      assertMinor(item.amountMinor, "installment amountMinor");
      return {
        dueISO: item.dueISO,
        amountSAR: minorToGeneratedSar(item.amountMinor),
      };
    }),
    events: record.events.map((event) => ({ ...event })),
  };
}

function mobileRecord(record: GeneratedRecord): AhdRecord {
  return {
    id: record.id,
    lender: record.lender,
    borrower: record.borrower,
    amountMinor: engine.toMinor(record.amountSAR),
    installments: record.installments.map((item) => ({
      dueISO: item.dueISO,
      amountMinor: engine.toMinor(item.amountSAR),
    })),
    events: record.events.map((event) => ({ ...event })),
  };
}

function prepareDraft(input: AhdDraftInput): PreparedAhd {
  assertMinor(input.amountMinor);
  const open = Boolean(input.open);
  const months = open ? 0 : (input.months ?? 1);
  if (!open && (!Number.isSafeInteger(months) || months < 1)) {
    throw new TypeError("months must be a positive integer");
  }

  const sourceDraft = createFeature.makeDraft({
    id: input.id,
    lender: input.lender,
    borrower: input.borrower,
    amountSAR: minorToGeneratedSar(input.amountMinor),
    months,
    open,
    start: input.start ?? { y: 2026, m: 7 },
    timestamp: input.timestamp ?? "2026-07-01T10:00:00+03:00",
    purpose: input.purpose ?? "",
  });
  const schedule = createFeature.draftSchedule(sourceDraft, engine);

  return {
    id: sourceDraft.id,
    lender: sourceDraft.lender,
    borrower: sourceDraft.borrower,
    amountMinor: sourceDraft.amountMinor,
    open: sourceDraft.open,
    months: sourceDraft.months,
    termsAr: createFeature.draftTermsAr(sourceDraft, engine),
    schedule: schedule.map((item) => ({ ...item })),
    sourceDraft,
  };
}

function screenTerms(termsAr: string): RibaScreening {
  return createFeature.ribaCheck(termsAr, engine);
}

function verifySealed(sealed: SealedAhd, tamperAmountMinor?: number): SealVerification {
  if (tamperAmountMinor !== undefined) assertMinor(tamperAmountMinor, "tamperAmountMinor");
  const result = createFeature.verifyCreated(
    sealed.prepared.sourceDraft,
    engine,
    tamperAmountMinor === undefined ? undefined : minorToGeneratedSar(tamperAmountMinor),
  );
  return {
    ok: result.ok,
    sealed: result.sealed,
    recomputed: result.recomputed,
    canonicalHash: result.canonical_hash,
  };
}

function sealPrepared(prepared: PreparedAhd): SealedAhd {
  const termsAr = createFeature.draftTermsAr(prepared.sourceDraft, engine);
  const screening = screenTerms(termsAr);
  if (screening.verdict !== "clean") throw new RibaBlockedError(screening);

  const canonical = createFeature.createCanonical(prepared.sourceDraft, engine);
  const sealResult = createFeature.createSeal(prepared.sourceDraft, engine);
  const record = mobileRecord(createFeature.toDaftariRecord(prepared.sourceDraft, engine));
  const sealed: SealedAhd = {
    prepared,
    termsAr,
    screening,
    canonical,
    canonicalHash: sealResult.canonical_hash,
    seal: sealResult.seal,
    verification: {
      ok: false,
      sealed: sealResult.seal,
      recomputed: "",
      canonicalHash: sealResult.canonical_hash,
    },
    record,
  };
  sealed.verification = verifySealed(sealed);
  return sealed;
}

function buildProof(record: AhdRecord): ProofPack {
  return proofFeature.buildProofPack(generatedRecord(record), engine);
}

function verifyProof(record: AhdRecord, tamperAmountMinor?: number): ProofVerification {
  if (tamperAmountMinor !== undefined) assertMinor(tamperAmountMinor, "tamperAmountMinor");
  return proofFeature.verifyProof(
    generatedRecord(record),
    engine,
    tamperAmountMinor === undefined ? undefined : minorToGeneratedSar(tamperAmountMinor),
  );
}

function requestExternal(
  operation: NeedsConnection["operation"],
  sealed: Readonly<SealedAhd>,
): NeedsConnection {
  return { status: "needs_connection", operation, recordId: sealed.record.id };
}

function buildSettlement(transfers: readonly SettlementTransfer[]): SettlementResult {
  const generatedTransfers = transfers.map((transfer) => {
    assertMinor(transfer.amountMinor);
    return {
      from: transfer.from,
      to: transfer.to,
      amount: minorToGeneratedSar(transfer.amountMinor),
    };
  });
  const result = settlementFeature.settlementView(generatedTransfers, engine);
  return {
    before: transfers.map((transfer) => ({ ...transfer })),
    after: result.after.map((transfer) => ({
      from: transfer.from,
      to: transfer.to,
      amountMinor: engine.toMinor(transfer.amount),
    })),
    beforeCount: result.beforeCount,
    afterCount: result.afterCount,
    conserved: result.conserved,
  };
}

export const ahdCore = Object.freeze({
  AS_OF,
  parseSarTextToMinor,
  formatMinorSar,
  prepareDraft,
  screenTerms,
  sealPrepared,
  verifySealed,
  buildProof,
  verifyProof,
  requestExternal,
  buildSettlement,
});

interface GeneratedEngine {
  toMinor(amountSAR: number): number;
}

interface GeneratedDraft {
  id: string;
  type: string;
  lender: string;
  borrower: string;
  amountMinor: number;
  open: boolean;
  months: number;
  start: { y: number; m: number };
  timestamp: string;
  purpose: string;
}

interface GeneratedScheduleItem {
  label: string;
  dueISO: string;
  amountMinor: number;
}

interface GeneratedRecord {
  id: string;
  lender: string;
  borrower: string;
  amountSAR: number;
  installments: Array<{ dueISO: string | null; amountSAR: number }>;
  events: AhdEvent[];
}

interface GeneratedCreate {
  makeDraft(input: Record<string, unknown>): GeneratedDraft;
  draftSchedule(draft: GeneratedDraft, engine: GeneratedEngine): GeneratedScheduleItem[];
  draftTermsAr(draft: GeneratedDraft, engine: GeneratedEngine): string;
  ribaCheck(termsAr: string, engine: GeneratedEngine): RibaScreening;
  createCanonical(draft: GeneratedDraft, engine: GeneratedEngine): string;
  createSeal(
    draft: GeneratedDraft,
    engine: GeneratedEngine,
  ): { canonical_hash: string; seal: string };
  verifyCreated(
    draft: GeneratedDraft,
    engine: GeneratedEngine,
    tamperSAR?: number,
  ): { ok: boolean; sealed: string; recomputed: string; canonical_hash: string };
  toDaftariRecord(draft: GeneratedDraft, engine: GeneratedEngine): GeneratedRecord;
}

interface GeneratedSettlement {
  settlementView(
    transfers: Array<{ from: string; to: string; amount: number }>,
    engine: GeneratedEngine,
  ): {
    beforeCount: number;
    afterCount: number;
    conserved: boolean;
    after: Array<{ from: string; to: string; amount: number }>;
  };
}

interface GeneratedProof {
  buildProofPack(record: GeneratedRecord, engine: GeneratedEngine): ProofPack;
  verifyProof(
    record: GeneratedRecord,
    engine: GeneratedEngine,
    tamperSAR?: number,
  ): ProofVerification;
}
