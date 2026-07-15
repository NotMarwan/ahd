import { describe, expect, test } from "@jest/globals";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const generatorPath = path.resolve(__dirname, "../../../scripts/generated-core.cjs");

function loadGenerator(): null | {
  SOURCE_FILES: readonly string[];
  syncGenerated(options?: { destinationRoot?: string }): void;
  checkGenerated(options?: { destinationRoot?: string }): {
    ok: boolean;
    drift: string[];
  };
} {
  if (!fs.existsSync(generatorPath)) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(generatorPath);
}

describe("generated golden core", () => {
  test("declares the exact Phase 1 source set", () => {
    const generator = loadGenerator();
    expect(generator).not.toBeNull();
    if (!generator) return;

    expect(generator.SOURCE_FILES).toEqual([
      "engine.js",
      "features/create.js",
      "features/riba-lint.js",
      "features/daftari.js",
      "features/settlement.js",
      "features/proof.js",
    ]);
  });

  test("detects a one-byte drift without changing the source", () => {
    const generator = loadGenerator();
    expect(generator).not.toBeNull();
    if (!generator) return;

    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ahd-mobile-core-"));
    try {
      generator.syncGenerated({ destinationRoot: temporaryRoot });
      expect(generator.checkGenerated({ destinationRoot: temporaryRoot })).toEqual({
        ok: true,
        drift: [],
      });

      fs.appendFileSync(path.join(temporaryRoot, "engine.js"), " ");
      expect(generator.checkGenerated({ destinationRoot: temporaryRoot })).toEqual({
        ok: false,
        drift: ["engine.js"],
      });
    } finally {
      fs.rmSync(temporaryRoot, { force: true, recursive: true });
    }
  });

  test("the checked-in generated tree is byte-faithful", () => {
    const generator = loadGenerator();
    expect(generator).not.toBeNull();
    if (!generator) return;

    expect(generator.checkGenerated()).toEqual({ ok: true, drift: [] });
  });
});
