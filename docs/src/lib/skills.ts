import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Agent Skills live in the repository root (../skills when building from docs/).
// They are read at build time and served byte-for-byte, so no copy is kept here.
const SKILLS_DIR = resolve(process.cwd(), '..', 'skills');

export const SKILLS_INDEX_SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

export interface Skill {
  name: string;
  description: string;
  /** Raw bytes of SKILL.md, served unchanged. */
  content: Buffer;
  /** `sha256:<hex>` over the raw bytes, as required by the discovery RFC. */
  digest: string;
  url: string;
}

// Minimal frontmatter reader for single-line `key: value` scalars. Anything it cannot read
// safely (quoted or multi-line values) fails the build instead of publishing a wrong value.
function readFrontmatterField(source: string, field: string, file: string): string {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);
  const line = match[1].split(/\r?\n/).find((l) => l.startsWith(`${field}:`));
  const value = line?.slice(field.length + 1).trim();
  if (!value) throw new Error(`${file}: missing "${field}" in frontmatter`);
  if (/^["'>|]/.test(value)) {
    throw new Error(`${file}: "${field}" must be a plain single-line value to be read here`);
  }
  return value;
}

export function loadSkills(): Skill[] {
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return dirs.map((dir) => {
    const file = join(SKILLS_DIR, dir, 'SKILL.md');
    const content = readFileSync(file);
    const source = content.toString('utf-8');
    const name = readFrontmatterField(source, 'name', file);
    if (name !== dir) throw new Error(`${file}: name "${name}" must match directory "${dir}"`);
    return {
      name,
      description: readFrontmatterField(source, 'description', file),
      content,
      digest: `sha256:${createHash('sha256').update(content).digest('hex')}`,
      url: `/.well-known/agent-skills/${name}/SKILL.md`,
    };
  });
}

/** The skill served at /skill.md. Only defined while the repository has exactly one skill. */
export function loadPrimarySkill(): Skill {
  const skills = loadSkills();
  if (skills.length !== 1) {
    throw new Error(`/skill.md expects exactly one skill in ${SKILLS_DIR}, found ${skills.length}`);
  }
  return skills[0];
}

export const markdownHeaders = { 'Content-Type': 'text/markdown; charset=utf-8' };
