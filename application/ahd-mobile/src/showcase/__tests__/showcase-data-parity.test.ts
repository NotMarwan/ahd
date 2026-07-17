import { describe, expect, it } from '@jest/globals';

import {
  SHOWCASE_CIRCLE,
  SHOWCASE_CREATE,
  SHOWCASE_DATE,
  SHOWCASE_PROFILE_NAME,
  SHOWCASE_RECORDS,
  SHOWCASE_SETTLEMENT,
} from '../showcase-data';

describe('mobile showcase parity with the Web App story', () => {
  it('uses the same pseudonymous viewer and urgent overdue Ahd', () => {
    expect(SHOWCASE_PROFILE_NAME).toBe('نايف العتيبي');
    expect(SHOWCASE_DATE).toBe('2026-06-21');
    expect(SHOWCASE_CREATE).toMatchObject({
      lender: 'نايف العتيبي',
      borrower: 'سلطان',
      amountSarText: '1200',
      purpose: 'سلفة شخصية بلا زيادة',
      agreementDate: '2026-04-15',
    });
  });

  it('carries the six canonical ledger entries in integer minor units', () => {
    expect(
      SHOWCASE_RECORDS.map(({ sealed }) => ({
        id: sealed.record.id,
        lender: sealed.record.lender,
        borrower: sealed.record.borrower,
        amountMinor: sealed.record.amountMinor,
        purpose: sealed.prepared.sourceDraft.purpose,
      })),
    ).toEqual([
      { id: 'AHD-CAFE', lender: 'نايف العتيبي', borrower: 'مقهى الحي', amountMinor: 250_000, purpose: 'عهد المقهى' },
      { id: 'AHD-SULTAN', lender: 'نايف العتيبي', borrower: 'سلطان', amountMinor: 120_000, purpose: 'سلفة شخصية بلا زيادة' },
      { id: 'AHD-ABD', lender: 'نايف العتيبي', borrower: 'عبدالله', amountMinor: 60_000, purpose: 'سلفة قصيرة' },
      { id: 'AHD-KEPT', lender: 'نايف العتيبي', borrower: 'ريم', amountMinor: 80_000, purpose: 'عهد مكتمل' },
      { id: 'AHD-DISP', lender: 'نايف العتيبي', borrower: 'ماجد', amountMinor: 90_000, purpose: 'عهد محل خلاف' },
      { id: 'AHD-FAHD', lender: 'فهد', borrower: 'نايف العتيبي', amountMinor: 300_000, purpose: 'سلفة من فهد' },
    ]);

    expect(SHOWCASE_RECORDS.every(({ sealed }) => Number.isInteger(sealed.record.amountMinor))).toBe(true);
  });

  it('uses the six-member neighborhood Jamiya and the unchanged golden netting sample', () => {
    expect(SHOWCASE_CIRCLE).toMatchObject({
      title: 'جمعية أهل الحي',
      organizer: 'أم سارة',
      startMonth: '2026-04',
    });
    expect(SHOWCASE_CIRCLE.members.map((member) => member.displayName)).toEqual([
      'أم سارة',
      'نورة',
      'هند',
      'منال',
      'عبير',
      'لجين',
    ]);
    expect(SHOWCASE_CIRCLE.members.every((member) => member.shareMinor === 100_000)).toBe(true);
    expect(SHOWCASE_SETTLEMENT.beforeCount).toBe(9);
    expect(SHOWCASE_SETTLEMENT.after).toEqual([
      { from: 'نورة', to: 'خالد', amountMinor: 60_000 },
      { from: 'نورة', to: 'فهد', amountMinor: 30_000 },
    ]);
  });
});
