import { describe, expect, test } from "@jest/globals";

type CoreModule = typeof import("../ahd-core");

function loadCore(): { core: CoreModule | null; error: unknown } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return { core: require("../ahd-core"), error: undefined };
  } catch (error) {
    return { core: null, error };
  }
}

const INPUT = {
  id: "MOBILE-1",
  lender: "أنت",
  borrower: "سلطان",
  amountMinor: 120_001,
  months: 3,
  start: { y: 2026, m: 7 },
  timestamp: "2026-07-01T10:00:00+03:00",
};

function requireCore(): CoreModule {
  const loaded = loadCore();
  expect(loaded.error).toBeUndefined();
  expect(loaded.core).not.toBeNull();
  if (!loaded.core) throw loaded.error;
  return loaded.core;
}

describe("typed Ahd core adapter", () => {
  test("parses SAR text into integer halalas without float money", () => {
    const { ahdCore } = requireCore();

    expect(ahdCore.parseSarTextToMinor("1200")).toBe(120_000);
    expect(ahdCore.parseSarTextToMinor("1200.5")).toBe(120_050);
    expect(ahdCore.parseSarTextToMinor("1200.05")).toBe(120_005);
    expect(ahdCore.parseSarTextToMinor("١٢٠٠٫٥٠")).toBe(120_050);
    expect(() => ahdCore.parseSarTextToMinor("-1.00")).toThrow("valid SAR amount");
    expect(() => ahdCore.parseSarTextToMinor("1,200.00")).toThrow("valid SAR amount");
    expect(() => ahdCore.parseSarTextToMinor("1٬200.00")).toThrow("valid SAR amount");
    expect(() => ahdCore.parseSarTextToMinor("1.234")).toThrow("valid SAR amount");
  });

  test("keeps principal and schedule in integer halalas", () => {
    const { ahdCore } = requireCore();
    const prepared = ahdCore.prepareDraft(INPUT);

    expect(prepared.amountMinor).toBe(120_001);
    expect(Number.isInteger(prepared.amountMinor)).toBe(true);
    expect(prepared.schedule.every((item) => Number.isInteger(item.amountMinor))).toBe(true);
    expect(prepared.schedule.reduce((sum, item) => sum + item.amountMinor, 0)).toBe(120_001);
    expect(() => ahdCore.prepareDraft({ ...INPUT, amountMinor: 120_000.5 })).toThrow(
      "integer halalas",
    );
  });

  test("blocks an explicit interest clause", () => {
    const { ahdCore } = requireCore();

    const result = ahdCore.screenTerms("عليه فائدة ٥٪.");

    expect(result.verdict).toBe("block");
    expect(result.hits.length).toBeGreaterThan(0);
  });

  test("screens, seals, and verifies through the generated golden functions", () => {
    const { ahdCore } = requireCore();
    const prepared = ahdCore.prepareDraft(INPUT);
    const sealed = ahdCore.sealPrepared(prepared);

    expect(sealed.screening.verdict).toBe("clean");
    expect(sealed.seal).toMatch(/^[0-9a-f]{64}$/);
    expect(sealed.verification.ok).toBe(true);
    expect(ahdCore.verifySealed(sealed).ok).toBe(true);
    expect(ahdCore.verifySealed(sealed, 999_900).ok).toBe(false);
  });

  test("builds and verifies the proof pack", () => {
    const { ahdCore } = requireCore();
    const sealed = ahdCore.sealPrepared(ahdCore.prepareDraft(INPUT));
    const proof = ahdCore.buildProof(sealed.record);

    expect(proof.seal).toMatch(/^[0-9a-f]{64}$/);
    expect(ahdCore.verifyProof(sealed.record).ok).toBe(true);
    expect(ahdCore.verifyProof(sealed.record, 999_900).ok).toBe(false);
  });

  test("returns needs_connection without mutating sealed state", () => {
    const { ahdCore } = requireCore();
    const sealed = ahdCore.sealPrepared(ahdCore.prepareDraft(INPUT));
    const before = JSON.stringify(sealed);

    const result = ahdCore.requestExternal("identity", sealed);

    expect(result).toEqual({
      status: "needs_connection",
      operation: "identity",
      recordId: "MOBILE-1",
    });
    expect(JSON.stringify(sealed)).toBe(before);
  });

  test("delegates settlement and returns integer-halalah transfers", () => {
    const { ahdCore } = requireCore();

    const result = ahdCore.buildSettlement([
      { from: "نورة", to: "سارة", amountMinor: 10_001 },
      { from: "سارة", to: "خالد", amountMinor: 10_001 },
    ]);

    expect(result.conserved).toBe(true);
    expect(result.after).toEqual([{ from: "نورة", to: "خالد", amountMinor: 10_001 }]);
    expect(result.after.every((item) => Number.isInteger(item.amountMinor))).toBe(true);
  });
});
