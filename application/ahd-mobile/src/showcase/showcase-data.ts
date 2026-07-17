import { ahdCore, type SettlementTransfer } from '@/core/ahd-core';
import { createShareEnvelope, serializeShareEnvelope } from '@/share';
import type {
  AhdStoredRecord,
  PilotCircle,
  PilotDailyEntry,
  PilotJamiyaSlice,
  PilotNettingReceipt,
} from '@/state';

export const SHOWCASE_PROFILE_NAME = 'نورة';
export const SHOWCASE_DATE = '2026-07-17';

export const SHOWCASE_CREATE = {
  lender: 'نورة',
  borrower: 'ليلى',
  amountSarText: '4800',
  purpose: 'مصاريف علاج طارئة',
  repaymentMode: 'scheduled' as const,
  monthsText: '6',
  firstDueMonth: '2026-08',
  agreementDate: SHOWCASE_DATE,
} as const;

export const SHOWCASE_DAILY_FORM = {
  title: 'دفعة هذا الشهر',
  note: 'سلّمت ليلى 800 ريال من دفعة هذا الشهر، وبقي الإيصال في الدفتر المحلي.',
  effectiveDate: SHOWCASE_DATE,
} as const;

export const SHOWCASE_REQUEST_FORM = {
  lender: 'سارة',
  amountText: '2500',
  purpose: 'إصلاح السيارة',
  effectiveDate: SHOWCASE_DATE,
} as const;

export const SHOWCASE_JAMIYA_FORM = {
  title: 'جمعية الأهل',
  startMonth: '2026-08',
  amountText: '1000',
  membersText: 'سارة، ليلى، خالد، فهد',
  consentDate: SHOWCASE_DATE,
  paymentDate: '2026-08-01',
} as const;

export const SHOWCASE_DISPUTE_FORM = {
  reason: 'اختلف الطرفان على إثبات دفعة يونيو، ويحتاجان إرفاق الإيصال فقط.',
  effectiveDate: SHOWCASE_DATE,
  reconciliationDate: '2026-07-20',
} as const;

export const SHOWCASE_BOUNDS_TERMS = 'إذا تأخر السداد تُضاف غرامة 100 ريال.';

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
    id: 'AHD-DEMO-0001',
    lender: 'نورة',
    borrower: 'ليلى',
    amountMinor: 480_000,
    months: 6,
    start: { y: 2026, m: 8 },
    timestamp: '2026-07-17T09:00:00+03:00',
    purpose: 'مصاريف علاج طارئة',
  }),
  buildRecord({
    id: 'AHD-DEMO-0002',
    lender: 'سارة',
    borrower: 'نورة',
    amountMinor: 250_000,
    months: 5,
    start: { y: 2026, m: 9 },
    timestamp: '2026-07-17T09:10:00+03:00',
    purpose: 'إصلاح السيارة',
  }),
  buildRecord({
    id: 'AHD-DEMO-0003',
    lender: 'خالد',
    borrower: 'نورة',
    amountMinor: 180_000,
    open: true,
    timestamp: '2026-07-17T09:20:00+03:00',
    purpose: 'سلفة مرنة للأسرة',
  }),
] as const;

const consent = {
  mode: 'organizer_attestation' as const,
  recordedBy: SHOWCASE_PROFILE_NAME,
  effectiveDate: SHOWCASE_DATE,
  confirmed: true as const,
};

export const SHOWCASE_CIRCLE: PilotCircle = {
  id: 'CIRCLE-DEMO-0001',
  kind: 'jamiya',
  title: SHOWCASE_JAMIYA_FORM.title,
  organizer: SHOWCASE_PROFILE_NAME,
  startMonth: SHOWCASE_JAMIYA_FORM.startMonth,
  members: [
    { id: 'member-noura', displayName: 'نورة', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-sara', displayName: 'سارة', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-layla', displayName: 'ليلى', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-khalid', displayName: 'خالد', consentAttestation: consent, shareMinor: 100_000 },
    { id: 'member-fahad', displayName: 'فهد', consentAttestation: consent, shareMinor: 100_000 },
  ],
  orderMemberIds: ['member-noura', 'member-sara', 'member-layla', 'member-khalid', 'member-fahad'],
  payments: [
    { id: 'payment-demo-1', round: 1, memberId: 'member-noura', amountMinor: 100_000, effectiveDate: '2026-08-01' },
    { id: 'payment-demo-2', round: 1, memberId: 'member-sara', amountMinor: 100_000, effectiveDate: '2026-08-01' },
    { id: 'payment-demo-3', round: 1, memberId: 'member-layla', amountMinor: 100_000, effectiveDate: '2026-08-01' },
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
    recordId: SHOWCASE_RECORDS[0].sealed.record.id,
    reason: SHOWCASE_DISPUTE_FORM.reason,
    effectiveDate: SHOWCASE_DISPUTE_FORM.effectiveDate,
    status: 'open',
    externalStatus: 'needs_connection',
  },
] as const;

export const SHOWCASE_SHARE_ENVELOPE = serializeShareEnvelope(createShareEnvelope({
  record: SHOWCASE_RECORDS[0].sealed.record,
  proof: SHOWCASE_RECORDS[0].proof,
  exportedAt: '2026-07-17T09:00:00+03:00',
}));
