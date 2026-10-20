// Single source of truth for the supported Node.js versions.
// `fs.readdir(..., { recursive: true })` (used to copy the template) was added in
// Node.js v18.17.0 and v20.1.0 (never in v19). Older versions silently ignore the
// option and the generated project ends up without `src/index.ts`.
// package.json "engines.node", README.md and skills/ must match (enforced by test/).
export const NODE_ENGINES_RANGE = "^18.17.0 || >=20.1.0";

function parseVersion(version: string): [number, number, number] {
  const [major = 0, minor = 0, patch = 0] = version
    .replace(/^v/, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
  return [major, minor, patch];
}

function isAtLeast(current: string, minimum: string): boolean {
  const a = parseVersion(current);
  const b = parseVersion(minimum);
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

export function isSupportedNodeVersion(version: string): boolean {
  const [major] = parseVersion(version);
  if (major === 18) return isAtLeast(version, "18.17.0");
  return isAtLeast(version, "20.1.0");
}
