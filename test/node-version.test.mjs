import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { isSupportedNodeVersion, NODE_ENGINES_RANGE } from "../build/node-version.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf-8");

test("package.json engines.node matches NODE_ENGINES_RANGE", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.engines.node, NODE_ENGINES_RANGE);
});

test("README.md and the agent skill state the same Node.js range", () => {
  for (const path of ["README.md", "skills/create-mcp-tools/SKILL.md"]) {
    assert.ok(
      read(path).includes(NODE_ENGINES_RANGE),
      `${path} must mention Node.js ${NODE_ENGINES_RANGE}`,
    );
  }
});

test("the agent skill mentions no other Node.js range", () => {
  const skill = read("skills/create-mcp-tools/SKILL.md");
  const ranges = skill.match(/Node\.js `?[\^>=<~][^\s,`]*(?: \|\| [>=<^~][^\s,`]*)*/g) ?? [];
  assert.ok(ranges.length > 0);
  for (const range of ranges) {
    assert.equal(range.replace(/^Node\.js `?/, ""), NODE_ENGINES_RANGE);
  }
});

test("isSupportedNodeVersion follows NODE_ENGINES_RANGE", () => {
  // fs.readdir's `recursive` option exists from v18.17.0 and v20.1.0, never in v19.
  for (const v of ["18.16.1", "19.9.0", "20.0.0", "16.20.2"]) {
    assert.equal(isSupportedNodeVersion(v), false, v);
  }
  for (const v of ["18.17.0", "18.20.8", "20.1.0", "22.0.0", "v24.1.0"]) {
    assert.equal(isSupportedNodeVersion(v), true, v);
  }
});
