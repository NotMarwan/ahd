import { ahdCore, type SettlementTransfer } from '@/core/ahd-core';
import { createShareEnvelope, serializeShareEnvelope } from '@/share';
import type {
  AhdStoredRecord,
  PilotCircle,
  PilotDailyEntry,
  PilotJamiyaSlice,
  PilotNettingReceipt,
} from '@/state';

export const SHOWCASE_PROFILE_NAME = 'نايف العتيبي';
export const SHOWCASE_DATE = '2026-06-21';

export const SHOWCASE_CREATE = {
  lender: SHOWCASE_PROFILE_NAME,
  borrower: 'سلطان',
  amountSarText: '1200',
  purpose: 'سلفة شخصية بلا زيادة',
  repaymentMode: 'scheduled' as const,
  monthsText: '1',
  firstDueMonth: '2026-05',
  agreementDate: '2026-04-15',
} as const;

export const SHOWCASE_DAILY_FORM = {
  title: 'قيد اليوم',
  note: 'سلّمت عبدالله 200 ريال نقدًا من دفعة يونيو، وحُفظ القيد في الدفتر المحلي.',
  effectiveDate: SHOWCASE_DATE,
} as const;

export const SHOWCASE_REQUEST_FORM = {
  lender: 'خالد',
  amountText: '2500',
  purpose: 'إصلاح السيارة',
  effectiveDate: SHOWCASE_DATE,
} as const;

export const SHOWCASE_JAMIYA_FORM = {
  title: 'جمعية أهل الحي',
  startMonth: '2026-04',
  amountText: '1000',
  membersText: 'نورة، هند، منال، عبير، لجين',
  consentDate: SHOWCASE_DATE,
  paymentDate: '2026-06-01',
} as const;

export const SHOWCASE_DISPUTE_FORM = {
  reason: 'اختلف ماجد ونايف على إثبات دفعة يونيو؛ جُمّد العهد حتى يرفقا الإيصال.',
  effectiveDate: SHOWCASE_DATE,
  reconciliationDate: '2026-07-20',
} as const;

export const SHOWCASE_BOUNDS_TERMS = 'إذا تأخر السداد تُضاف غرامة 100 ريال؛ وهذا شرط محظور في عهد.';

function buildRecord(input: {
  id: string;
  lender: string;
  borrower: string;
  amountMinor: number;
  months?: number;
  open?: boolean;
  start?: { y: number; m: number };
  timestamp: string;
  purpose: string;
}): AhdStoredRecord {
  const prepared = ahdCore.prepareDraft(input);
  const sealed = ahdCore.sealPrepared(prepared);
  return { sealed, proof: ahdCore.buildProof(sealed.record), source: 'local' };
}

export const SHOWCASE_RECORDS: readonly AhdStoredRecord[] = [
  buildRecord({
    id: 'AHD-CAFE',
    lender: SHOWCASE_PROFILE_NAME,
    borrower: 'مقهى الحي',
    amountMinor: 250_000,
    months: 1,
    start: { y: 2026, m: 6 },
    timestamp: '2026-05-01T09:00:00+03:00',
    purpose: 'عهد المقهى',
  }),
  buildRecord({
    id: 'AHD-SULTAN',
    lender: SHOWCASE_PROFILE_NAME,
    borrower: 'سلطان',
    amountMinor: 120_000,
    months: 1,
    start: { y: 2026, m: 5 },
    timestamp: '2026-04-15T09:00:00+03:00',
    purpose: 'سلفة شخصية بلا زيادة',
  }),
  buildRecord({
    id: 'AHD-ABD',
    lender: SHOWCASE_PROFILE_NAME,
    borrower: 'عبدالله',
    amountMinor: 60_000,
    months: 1,
    start: { y: 2026, m: 7 },
    timestamp: '2026-06-01T09:00:00+03:00',
    purpose: 'سلفة قصيرة',
  }),
  buildRecord({
    id: 'AHD-KEPT',
    lender: SHOWCASE_PROFILE_NAME,
    borrower: 'ريم',
    amountMinor: 80_000,
    months: 1,
    start: { y: 2026, m: 4 },
    timestamp: '2026-03-01T09:00:00+03:00',
    purpose: 'عهد مكتمل',
  }),
  buildRecord({
    id: 'AHD-DISP',
    lender: SHOWCASE_PROFILE_NAME,
    borrower: 'ماجد',
    amountMinor: 90_000,
    months: 1,
    start: { y: 2026, m: 6 },
    timestamp: '2026-05-10T09:00:00+03:00',
    purpose: 'عهد محل خلاف',
  }),
  buildRecord({
    id: 'AHD-FAHD',
    lender: 'فهد',
    borrower: SHOWCASE_PROFILE_NAME,
    amountMinor: 300_000,
    months: 1,
    start: { y: 2026, m: 7 },
    timestamp: '2026-06-10T09:00:00+03:00',
    purpose: 'سلفة من فهد',
  }),
] as const;

export const SHOWCASE_OPEN_RECORD = buildRecord({
  id: 'AHD-OPEN',
  lender: 'منيرة',
  borrower: 'ماجد',
  amountMinor: 2_000_000,
  open: true,
  timestamp: '2026-06-21T09:30:00+03:00',
  purpose: 'قرض حسن مفتوح حتى يتيسّر السداد',
});

export const SHOWCASE_STANDING_RECORD = buildRecord({
  id: 'AHD-STANDING',
  lender: 'أبو فهد',
  borrower: 'راميش',
  amountMinor: 320_000,
  open: true,
  timestamp: '2026-01-01T09:00:00+03:00',
  purpose: 'سلفة بالمعروف بقيد شهري 800 ريال',
});

const consent = {
  mode: 'organizer_attestation' as const,
  recordedBy: 'أم سارة',
  effectiveDate: SHOWCASE_DATE,
  confirmed: true as const,
};

export const SHOWCASE_CIRCLE: PilotCircle = {
  id: 'CIRCLE-DEMO-0001',
  kind: 'jamiya',
  title: SHOWCASE_JAMIYA_FORM.title,
  organizer: 'أم سارة',
  startMonth: SHOWCASE_JAMIYA_FORM.startMonth,
  members: [
    { id: 'member-um-sara', displayName: 'أم سارة', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-noura', displayName: 'نورة', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-hind', displayName: 'هند', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-manal', displayName: 'منال', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-abeer', displayName: 'عبير', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-lujain', displayName: 'لجين', consentAttestation: consent, shareMinor: 100_000 },
  ],
  orderMemberIds: ['member-um-sara', 'member-noura', 'member-hind', 'member-manal', 'member-abeer', 'member-lujain'],
  payments: [
    { id: 'payment-demo-1', round: 3, memberId: 'member-um-sara', amountMinor: 100_000, effectiveDate: '2026-06-01' },
    { id: 'payment-demo-2', round: 3, memberId: 'member-noura', amountMinor: 100_000, effectiveDate: '2026-06-01' },
    { id: 'payment-demo-3', round: 3, memberId: 'member-manal', amountMinor: 100_000, effectiveDate: '2026-06-01' },
    { id: 'payment-demo-4', round: 3, memberId: 'member-abeer', amountMinor: 100_000, effectiveDate: '2026-06-01' },
  ],
  status: 'active',
};

export const SHOWCASE_SETTLEMENT_TRANSFERS = [
  { from: 'نورة', to: 'سارة', amountMinor: 20_000 },
  { from: 'سارة', to: 'خالد', amountMinor: 20_000 },
  { from: 'نورة', to: 'ليلى', amountMinor: 25_000 },
  { from: 'ليلى', to: 'فهد', amountMinor: 25_000 },
  { from: 'نورة', to: 'خالد', amountMinor: 40_000 },
  { from: 'نورة', to: 'فهد', amountMinor: 5_000 },
  { from: 'سارة', to: 'ليلى', amountMinor: 15_000 },
  { from: 'ليلى', to: 'خالد', amountMinor: 15_000 },
  { from: 'خالد', to: 'سارة', amountMinor: 15_000 },
] as const satisfies readonly SettlementTransfer[];

export const SHOWCASE_SETTLEMENT = ahdCore.buildSettlement(SHOWCASE_SETTLEMENT_TRANSFERS);
export const SHOWCASE_SETTLEMENT_PARTICIPANTS = ['نورة', 'سارة', 'خالد', 'ليلى', 'فهد'] as const;

export const SHOWCASE_NETTING_RECEIPT: PilotNettingReceipt = {
  id: 'NETTING-DEMO-0001',
  circleIds: [SHOWCASE_CIRCLE.id],
  before: SHOWCASE_SETTLEMENT.before,
  after: SHOWCASE_SETTLEMENT.after,
  beforeCount: SHOWCASE_SETTLEMENT.beforeCount,
  afterCount: SHOWCASE_SETTLEMENT.afterCount,
  conserved: SHOWCASE_SETTLEMENT.conserved,
  consentConfirmed: true,
  effectiveDate: SHOWCASE_DATE,
};

export const SHOWCASE_JAMIYA: PilotJamiyaSlice = {
  version: 2,
  circles: [SHOWCASE_CIRCLE],
  activeCircleId: SHOWCASE_CIRCLE.id,
  nettingReceipts: [SHOWCASE_NETTING_RECEIPT],
  legacySnapshot: null,
};

export const SHOWCASE_DAILY_ENTRIES: readonly PilotDailyEntry[] = [
  {
    kind: 'note',
    id: 'NOTE-DEMO-0001',
    title: SHOWCASE_DAILY_FORM.title,
    note: SHOWCASE_DAILY_FORM.note,
    effectiveDate: SHOWCASE_DAILY_FORM.effectiveDate,
  },
  {
    kind: 'request',
    id: 'REQUEST-DEMO-0001',
    borrower: SHOWCASE_PROFILE_NAME,
    lender: SHOWCASE_REQUEST_FORM.lender,
    amountMinor: 250_000,
    purpose: SHOWCASE_REQUEST_FORM.purpose,
    termsAr: 'قرض حسن بلا زيادة مشروطة ولا غرامة.',
    effectiveDate: SHOWCASE_REQUEST_FORM.effectiveDate,
    status: 'needs_connection',
  },
  {
    kind: 'dispute',
    id: 'DISPUTE-DEMO-0001',
    recordId: 'AHD-DISP',
    reason: SHOWCASE_DISPUTE_FORM.reason,
    effectiveDate: SHOWCASE_DISPUTE_FORM.effectiveDate,
    status: 'open',
    externalStatus: 'needs_connection',
  },
] as const;

export const SHOWCASE_SHARE_ENVELOPE = serializeShareEnvelope(createShareEnvelope({
  record: SHOWCASE_RECORDS[0].sealed.record,
  proof: SHOWCASE_RECORDS[0].proof,
  exportedAt: '2026-06-21T09:00:00+03:00',
}));
