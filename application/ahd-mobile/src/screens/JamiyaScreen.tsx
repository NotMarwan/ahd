import { StyleSheet, Text, View } from 'react-native';

import { AppShell, RowGroup, ScreenHeader, Section, StatusChip } from '@/components';
import { ahdCore } from '@/core/ahd-core';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('../generated/engine.js') as GeneratedJamiyaEngine;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jamiya = require('../generated/features/jamiya.js') as GeneratedJamiyaFeature;

interface GeneratedJamiyaEngine {
  short: (hash: string, length?: number) => string;
}

interface GeneratedJamiyaPayment {
  round: number;
  month: string;
  member: string;
  recipient: string;
  amountMinor: number;
  seal: string;
}

interface GeneratedJamiyaContract {
  kind: 'jamiya';
  members: string[];
  monthlyMinor: number;
  startMonth: string;
  orderAgreed: string[];
  payments: GeneratedJamiyaPayment[];
  canonical_hash: string;
  seal: string;
}

interface GeneratedJamiyaScheduleItem {
  round: number;
  month: string;
  recipient: string;
  expectedPerMemberMinor: number;
}

interface GeneratedJamiyaFeature {
  makeJamiya: (spec: {
    members: string[];
    monthlyMinor: number;
    startMonth: string;
    orderAgreed: string[];
  }) => GeneratedJamiyaContract;
  jamiyaSchedule: (contract: GeneratedJamiyaContract) => GeneratedJamiyaScheduleItem[];
  recordPayment: (
    contract: GeneratedJamiyaContract,
    entry: { round: number; member: string },
  ) => GeneratedJamiyaContract;
  foldJamiya: (contract: GeneratedJamiyaContract) => {
    paid: boolean[][];
    currentRound: number;
    whoReceived: string[];
  };
  conservation: (contract: GeneratedJamiyaContract) => { ok: boolean; surplusMinor: number };
  jamiyaSeal: (contract: GeneratedJamiyaContract) => GeneratedJamiyaContract;
  verifyJamiya: (contract: GeneratedJamiyaContract) => { ok: boolean };
  jamiyaTermsAr: (contract: GeneratedJamiyaContract) => string;
  jamiyaStatusAr: (contract: GeneratedJamiyaContract) => string;
}

function demoJamiya(): GeneratedJamiyaContract {
  const members = ['أم سارة', 'نورة', 'هند', 'منال', 'عبير', 'لجين'];
  let contract = jamiya.jamiyaSeal(
    jamiya.makeJamiya({
      members,
      monthlyMinor: 100000,
      startMonth: '2026-07',
      orderAgreed: ['أم سارة', 'هند', 'نورة', 'لجين', 'منال', 'عبير'],
    }),
  );
  for (let round = 0; round < 2; round += 1) {
    for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
      contract = jamiya.recordPayment(contract, { round, member: members[memberIndex] });
    }
  }
  for (let memberIndex = 0; memberIndex < 4; memberIndex += 1) {
    contract = jamiya.recordPayment(contract, { round: 2, member: members[memberIndex] });
  }
  return contract;
}

export function JamiyaScreen() {
  const contract = demoJamiya();
  const verification = jamiya.verifyJamiya(contract);
  const invariant = jamiya.conservation(contract);
  const schedule = jamiya.jamiyaSchedule(contract);
  const folded = jamiya.foldJamiya(contract);
  const paidCount = contract.payments.length;
  const total = contract.members.length * contract.members.length;

  return (
    <AppShell testID="jamiya-screen">
      <ScreenHeader
        eyebrow="شهادةٌ بلا حيازة"
        title="الجمعية الموثّقة"
        subtitle="ترتيبٌ بالتراضي، وكل دفعةٍ حدثٌ مختوم. الأموال لا تمر بالمصرف."
      />

      <Section title="عقد الجمعية">
        <RowGroup>
          <View style={styles.contractRow}>
            <View style={styles.titleRow}>
              <Text style={styles.contractTitle}>الجمعية الموثّقة</Text>
              <StatusChip label={jamiya.jamiyaStatusAr(contract)} tone="verified" />
            </View>
            <Text style={styles.statText}>الأعضاء · {contract.members.length}</Text>
            <Text style={styles.statText}>
              شهريًّا لكل عضو · {ahdCore.formatMinorSar(contract.monthlyMinor)}
            </Text>
            <Text style={styles.statText}>
              قيمة الاستلام ·{' '}
              {ahdCore.formatMinorSar(contract.monthlyMinor * contract.members.length)}
            </Text>
            <Text style={styles.sealText}>SEAL {engine.short(contract.seal, 24)}…</Text>
            <Text style={styles.sealText}>{verification.ok ? '✓ الختم سليم' : '✗ الختم غير مطابق'}</Text>
            <Text style={styles.statText}>
              حفظ القيمة: الداخل = الخارج · الفائض {ahdCore.formatMinorSar(invariant.surplusMinor)}
            </Text>
            <Text style={styles.termsText}>{jamiya.jamiyaTermsAr(contract)}</Text>
          </View>
        </RowGroup>
      </Section>

      <Section title="ترتيب الاستلام المتفق عليه">
        <RowGroup>
          {contract.orderAgreed.map((member, index) => (
            <View key={member} style={styles.orderRow}>
              <Text style={styles.orderText}>
                {index + 1}. {member}
              </Text>
            </View>
          ))}
        </RowGroup>
      </Section>

      <Section title={`دفعات الشهور المختومة · ${paidCount} من ${total}`}>
        <RowGroup>
          {schedule.map((item, round) => (
            <View key={item.month} style={styles.roundRow}>
              <Text style={styles.roundHeading}>
                الجولة {round + 1} · {item.month} · {item.recipient}
                {round === folded.currentRound ? ' · المستفيد الحالي' : ''}
              </Text>
              <Text style={styles.statText}>
                دفع {folded.paid[round].filter(Boolean).length} من {contract.members.length}
              </Text>
            </View>
          ))}
        </RowGroup>
      </Section>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  contractRow: {
    gap: spacing.x1,
    padding: spacing.x3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.x2,
  },
  contractTitle: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  statText: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  sealText: {
    ...typography.secondary,
    color: colors.seal,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  termsText: {
    ...typography.secondary,
    color: colors.inkSecondary,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  orderRow: {
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  orderText: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
  roundRow: {
    gap: spacing.x1,
    padding: spacing.x3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  roundHeading: {
    ...typography.row,
    color: colors.ink,
    fontFamily: fontFamilies.body,
    textAlign: 'right',
  },
});
