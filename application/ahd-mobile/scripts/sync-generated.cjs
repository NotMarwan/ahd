"use strict";

const { SOURCE_FILES, syncGenerated } = require("./generated-core.cjs");

syncGenerated();
process.stdout.write(`Synced ${SOURCE_FILES.length} byte-faithful Phase 1 core files.\n`);
