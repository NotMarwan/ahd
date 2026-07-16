import { useMemo, type ReactNode } from 'react';

import { AhdJourneyProvider } from './ahd-store';
import { AhdJourneyStore } from './journey-store';
import { PilotHydrationGate } from './pilot-bootstrap';
import { JourneySliceRepository } from './pilot-repository';
import { PilotProvider, PilotStore } from './pilot-store';
import { WebPilotRepository } from './web-pilot-repository';

export function PilotDatabaseProvider({ children }: { children: ReactNode }) {
  const stores = useMemo(() => {
    const repository = new WebPilotRepository(globalThis.localStorage);
    const journey = new AhdJourneyStore(new JourneySliceRepository(repository));
    return {
      pilot: new PilotStore(repository, () => journey.resetAfterExternalClear()),
      journey,
    };
  }, []);

  return (
    <PilotProvider store={stores.pilot}>
      <AhdJourneyProvider store={stores.journey}>
        <PilotHydrationGate>{children}</PilotHydrationGate>
      </AhdJourneyProvider>
    </PilotProvider>
  );
}
