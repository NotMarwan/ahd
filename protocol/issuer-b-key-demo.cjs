"use strict";
/* Fixed demo-only second issuer key. Public verification remains independent. */
const ISSUER_B_PRIVATE_KEY_PEM =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MC4CAQAwBQYDK2VwBCIEIIgFqaL+8gXIvNbNN9NQ9krzWHvOU40ZKxyem75IEIas\n" +
  "-----END PRIVATE KEY-----\n";
const ISSUER_B_PUBLIC_KEY_PEM =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCowBQYDK2VwAyEAO+0UpEZKdkFgPmbqpbqnrqDur411wyxVwN3QqTI2JMc=\n" +
  "-----END PUBLIC KEY-----\n";
module.exports = { ISSUER_B_PRIVATE_KEY_PEM: ISSUER_B_PRIVATE_KEY_PEM, ISSUER_B_PUBLIC_KEY_PEM: ISSUER_B_PUBLIC_KEY_PEM, VERIFICATION_METHOD: "ahd-issuer-b-demo-key-2026#ed25519-1", CRYPTOSUITE: "ahd-eddsa-2026-demo" };
