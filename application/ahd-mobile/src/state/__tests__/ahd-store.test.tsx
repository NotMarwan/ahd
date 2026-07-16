import { act, renderHook } from "@testing-library/react-native";
import { describe, expect, test } from "@jest/globals";
import type { PropsWithChildren } from "react";

import { ahdCore } from "../../core/ahd-core";
import { InMemoryAhdRepository } from "../ahd-repository";
import { AhdJourneyStore } from "../journey-store";

type StoreModule = typeof import("../ahd-store");
type StateIndex = typeof import("../index");

function loadBindings(): { store: StoreModule | null; index: StateIndex | null; error: unknown } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return { store: require("../ahd-store"), index: require("../index"), error: undefined };
  } catch (error) {
    return { store: null, index: null, error };
  }
}

function requireBindings(): { store: StoreModule; index: StateIndex } {
  const loaded = loadBindings();
  expect(loaded.error).toBeUndefined();
  expect(loaded.store).not.toBeNull();
  expect(loaded.index).not.toBeNull();
  if (!loaded.store || !loaded.index) throw loaded.error;
  return { store: loaded.store, index: loaded.index };
}

describe("Ahd journey React binding", () => {
  test("fails clearly when the hook is used outside its provider", async () => {
    const { store } = requireBindings();

    await expect(renderHook(() => store.useAhdJourney())).rejects.toThrow(
      "useAhdJourney must be used within AhdJourneyProvider",
    );
  });

  test("owns one injected store and updates React after every transition", async () => {
    const { store, index } = requireBindings();
    expect(index.AhdJourneyProvider).toBe(store.AhdJourneyProvider);
    expect(index.useAhdJourney).toBe(store.useAhdJourney);

    const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository(), ahdCore);
    const Wrapper = ({ children }: PropsWithChildren) => (
      <store.AhdJourneyProvider store={journeyStore}>{children}</store.AhdJourneyProvider>
    );
    const hook = await renderHook(() => store.useAhdJourney(), { wrapper: Wrapper });
    const firstStore = hook.result.current.store;

    expect(firstStore).toBe(journeyStore);
    expect(hook.result.current.state.step).toBe("home");

    await act(async () => { await hook.result.current.beginCreate(); });
    expect(hook.result.current.state.step).toBe("create");

    await act(async () => {
      await hook.result.current.reviewDraftFromForm({
        id: "MOBILE-PROVIDER-1",
        lender: "أنت",
        borrower: "سلطان",
        amountSarText: "1200.05",
        months: 3,
      });
    });
    expect(hook.result.current.state.step).toBe("riba_check");
    expect(hook.result.current.state.prepared?.amountMinor).toBe(120_005);

    await act(async () => { await hook.result.current.seal(); });
    expect(hook.result.current.state.step).toBe("sealed");

    await act(async () => { await hook.result.current.openDaftari(); });
    expect(hook.result.current.state.step).toBe("daftari");

    await act(async () => { await hook.result.current.openRecord(); });
    expect(hook.result.current.state.step).toBe("record_detail");

    await act(async () => {
      await hook.result.current.settle(["MOBILE-PROVIDER-1"], true);
    });
    expect(hook.result.current.state.step).toBe("settlement");

    await act(async () => { await hook.result.current.verifyProof(); });
    expect(hook.result.current.state.step).toBe("proof");
    expect(hook.result.current.state.proofVerification?.ok).toBe(true);

    await hook.rerender(undefined);
    expect(hook.result.current.store).toBe(firstStore);
  });

  test("creates one stable store from an injected repository", async () => {
    const { store } = requireBindings();
    const repository = new InMemoryAhdRepository();
    const Wrapper = ({ children }: PropsWithChildren) => (
      <store.AhdJourneyProvider repository={repository}>{children}</store.AhdJourneyProvider>
    );
    const hook = await renderHook(() => store.useAhdJourney(), { wrapper: Wrapper });
    const firstStore = hook.result.current.store;

    await act(async () => { await hook.result.current.beginCreate(); });
    await hook.rerender(undefined);

    expect(hook.result.current.store).toBe(firstStore);
    expect(hook.result.current.state.step).toBe("create");
  });

  test("reacts immediately when full local deletion resets the journey", async () => {
    const { store } = requireBindings();
    const journeyStore = new AhdJourneyStore(new InMemoryAhdRepository(), ahdCore);
    const Wrapper = ({ children }: PropsWithChildren) => (
      <store.AhdJourneyProvider store={journeyStore}>{children}</store.AhdJourneyProvider>
    );
    const hook = await renderHook(() => store.useAhdJourney(), { wrapper: Wrapper });
    await act(async () => { await hook.result.current.beginCreate(); });
    expect(hook.result.current.state.step).toBe("create");

    await act(async () => { journeyStore.resetAfterExternalClear(); });

    expect(hook.result.current.state.step).toBe("home");
  });
});
