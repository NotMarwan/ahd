import { Share } from 'react-native';

export type NativeShareResult = 'opened' | 'dismissed';

export async function sharePilotExport(serialized: string): Promise<NativeShareResult> {
  const result = await Share.share(
    { title: 'تصدير بيانات عهد التجريبي', message: serialized },
    { dialogTitle: 'صدّر بيانات عهد' },
  );
  return result.action === Share.dismissedAction ? 'dismissed' : 'opened';
}

export async function shareEnvelopeText(serialized: string): Promise<NativeShareResult> {
  const result = await Share.share(
    { title: 'سجل عهد مختوم', message: serialized },
    { dialogTitle: 'شارك سجل العهد' },
  );
  return result.action === Share.dismissedAction ? 'dismissed' : 'opened';
}
