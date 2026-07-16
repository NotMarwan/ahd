import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useMemo, type ReactNode } from 'react';

import { AhdJourneyProvider } from './ahd-store';
import { AhdJourneyStore } from './journey-store';
import { ExpoSQLitePilotRepository } from './expo-sqlite-pilot-repository';
import { PilotHydrationGate } from './pilot-bootstrap';
import { JourneySliceRepository } from './pilot-repository';
import { PilotProvider, PilotStore } from './pilot-store';

function SQLitePilotRuntime({ children }: { children: ReactNode }) {
  const database = useSQLiteContext();
  const stores = useMemo(() => {
    const repository = new ExpoSQLitePilotRepository(database);
    const journey = new AhdJourneyStore(new JourneySliceRepository(repository));
    return {
      pilot: new PilotStore(repository, () => journey.resetAfterExternalClear()),
      journey,
    };
  }, [database]);

  return (
    <PilotProvider store={stores.pilot}>
      <AhdJourneyProvider store={stores.journey}>
        <PilotHydrationGate>{children}</PilotHydrationGate>
      </AhdJourneyProvider>
    </PilotProvider>
  );
}

export function PilotDatabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SQLiteProvider databaseName="ahd-pilot.db">
      <SQLitePilotRuntime>{children}</SQLitePilotRuntime>
    </SQLiteProvider>
  );
}
