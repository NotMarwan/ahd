import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { InMemoryAhdRepository, AhdJourneyProvider, AhdJourneyStore } from '@/state';
import { CreateAhdScreen } from '../CreateAhdScreen';
import { DaftariScreen } from '../DaftariScreen';
import { HomeScreen } from '../HomeScreen';
import { ProofScreen } from '../ProofScreen';
import { RecordDetailScreen } from '../RecordDetailScreen';
import { SettlementScreen } from '../SettlementScreen';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({}),
}));

describe('رحلة عهد الأولى على الجوال', () => {
  it('تنقل العهد من الإنشاء إلى الختم والمقاصّة والتحقق من الإثبات', async () => {
    const store = new AhdJourneyStore(new InMemoryAhdRepository());
    const renderScreen = (screen: ReactElement) => render(
      <AhdJourneyProvider store={store}>{screen}</AhdJourneyProvider>,
    );

    let view = await renderScreen(<HomeScreen />);
    await fireEvent.press(view.getByRole('button', { name: 'ابدأ عهدًا جديدًا' }));
    await waitFor(() => expect(store.getState().step).toBe('create'));
    await view.unmount();

    view = await renderScreen(<CreateAhdScreen />);
    await fireEvent.changeText(view.getByLabelText('صاحب المال'), 'نورة');
    await fireEvent.changeText(view.getByLabelText('المستفيد'), 'سارة');
    await fireEvent.changeText(view.getByLabelText('مبلغ العهد بالريال'), '1200');
    await fireEvent.press(view.getByRole('button', { name: 'فحص الشروط' }));
    await waitFor(() => expect(store.getState().step).toBe('riba_check'));
    expect(view.getByText('الشروط خالية من الزيادة المشروطة')).toBeTruthy();

    await fireEvent.press(view.getByRole('button', { name: 'اختم العهد' }));
    await waitFor(() => expect(store.getState().step).toBe('sealed'));
    expect(view.getByText('إثبات محلي حتمي ومحفوظ على هذا الجهاز')).toBeTruthy();
    await fireEvent.press(view.getByRole('button', { name: 'افتح دفتري' }));
    await waitFor(() => expect(store.getState().step).toBe('daftari'));
    await view.unmount();

    view = await renderScreen(<DaftariScreen />);
    expect(view.getByText('1,200.00 ر.س')).toBeTruthy();
    await fireEvent.press(view.getByRole('button', { name: 'فتح تفاصيل العهد' }));
    await waitFor(() => expect(store.getState().step).toBe('record_detail'));
    await view.unmount();

    view = await renderScreen(<RecordDetailScreen />);
    await fireEvent.press(view.getByRole('button', { name: 'فتح المقاصّة' }));
    await view.unmount();

    view = await renderScreen(<SettlementScreen />);
    await fireEvent.press(view.getByRole('button', { name: 'شغّل مقاصّة الشبكة' }));
    await waitFor(() => expect(store.getState().step).toBe('settlement'));
    expect(view.getByText('حُفظ مجموع الالتزامات')).toBeTruthy();
    await fireEvent.press(view.getByRole('button', { name: 'التحقق من الإثبات' }));
    await waitFor(() => expect(store.getState().step).toBe('proof'));
    await view.unmount();

    view = await renderScreen(<ProofScreen />);
    expect(view.getByText('الختم مطابق للسجل')).toBeTruthy();
    expect(view.queryByText(/contentHash:/)).toBeNull();
    await fireEvent.press(view.getByRole('button', { name: 'طلب إثبات خارجي' }));
    await waitFor(() => expect(store.getState().connection?.status).toBe('needs_connection'));
    expect(view.getByText('يتطلب اتصالًا بالخدمة الخارجية')).toBeTruthy();
  }, 15_000);
});
