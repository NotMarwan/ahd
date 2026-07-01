export function debugLog(scope: string, message: string): void {
  if (process.env.DEBUG) {
    process.stderr.write(`[${scope}] ${message}\n`);
  }
}
