import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { AhdDraftInput, NeedsConnection, SettlementTransfer } from "../core/ahd-core";
import { InMemoryAhdRepository, type AhdRepository } from "./ahd-repository";
import {
  AhdJourneyStore,
  type AhdDraftFormInput,
  type AhdJourneyState,
} from "./journey-store";

export interface AhdJourneyContextValue {
  state: AhdJourneyState;
  store: AhdJourneyStore;
  hydrate(): Promise<AhdJourneyState>;
  beginCreate(): Promise<AhdJourneyState>;
  reviewDraft(input: AhdDraftInput): Promise<AhdJourneyState>;
  reviewDraftFromForm(input: AhdDraftFormInput): Promise<AhdJourneyState>;
  seal(): Promise<AhdJourneyState>;
  openDaftari(): Promise<AhdJourneyState>;
  openRecord(): Promise<AhdJourneyState>;
  settle(transfers: readonly SettlementTransfer[]): Promise<AhdJourneyState>;
  verifyProof(): Promise<AhdJourneyState>;
  requestExternal(operation: NeedsConnection["operation"]): Promise<AhdJourneyState>;
}

export interface AhdJourneyProviderProps {
  children: ReactNode;
  store?: AhdJourneyStore;
  repository?: AhdRepository<AhdJourneyState>;
}

const AhdJourneyContext = createContext<AhdJourneyContextValue | undefined>(undefined);

export function AhdJourneyProvider({
  children,
  store: injectedStore,
  repository,
}: AhdJourneyProviderProps) {
  if (injectedStore && repository) {
    throw new Error("AhdJourneyProvider accepts either store or repository, not both");
  }

  const [store] = useState(
    () => injectedStore
      ?? new AhdJourneyStore(repository ?? new InMemoryAhdRepository<AhdJourneyState>()),
  );
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  const transition = useCallback(
    async (operation: (journey: AhdJourneyStore) => Promise<AhdJourneyState>) => {
      const next = await operation(store);
      return next;
    },
    [store],
  );

  const value = useMemo<AhdJourneyContextValue>(() => ({
    state,
    store,
    hydrate: () => transition((journey) => journey.hydrate()),
    beginCreate: () => transition((journey) => journey.beginCreate()),
    reviewDraft: (input) => transition((journey) => journey.reviewDraft(input)),
    reviewDraftFromForm: (input) => transition((journey) => journey.reviewDraftFromForm(input)),
    seal: () => transition((journey) => journey.seal()),
    openDaftari: () => transition((journey) => journey.openDaftari()),
    openRecord: () => transition((journey) => journey.openRecord()),
    settle: (transfers) => transition((journey) => journey.settle(transfers)),
    verifyProof: () => transition((journey) => journey.verifyProof()),
    requestExternal: (operation) => transition((journey) => journey.requestExternal(operation)),
  }), [state, store, transition]);

  return <AhdJourneyContext.Provider value={value}>{children}</AhdJourneyContext.Provider>;
}

export function useAhdJourney(): AhdJourneyContextValue {
  const value = useContext(AhdJourneyContext);
  if (!value) {
    throw new Error("useAhdJourney must be used within AhdJourneyProvider");
  }
  return value;
}
