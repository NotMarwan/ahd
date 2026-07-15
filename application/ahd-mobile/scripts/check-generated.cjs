"use strict";

const { checkGenerated } = require("./generated-core.cjs");

const result = checkGenerated();
if (!result.ok) {
  process.stderr.write(`Generated core drift: ${result.drift.join(", ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Generated Phase 1 core is byte-faithful.\n");
}
