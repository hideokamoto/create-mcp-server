# AGENTS.md

Guidance for coding agents (and humans) working in this repository.

## Layout

- `src/` — the `create-mcp-tools` CLI (published to npm; see `files` in package.json)
- `template/` — files copied into generated projects (`.ejs` files are rendered with EJS)
- `skills/create-mcp-tools/SKILL.md` — Agent Skill that teaches agents how to use the CLI
  (not published to npm)
- `docs/` — Astro documentation site deployed to Cloudflare Workers Static Assets
  (not published to npm). It also serves `llms.txt` and the Agent Skill.

## Checks

Run these before pushing:

```bash
pnpm install
pnpm run lint
pnpm run typecheck
pnpm test          # builds, then runs test/*.test.mjs
cd docs && pnpm install --frozen-lockfile && pnpm run build
```

## Commits and releases

Releases are automated by semantic-release from Conventional Commits on `main`
(`.releaserc.json`, commit messages are checked by commitlint).

- `fix:` / `feat:` — changes users of the npm package see (CLI behavior, `--help`, template,
  README, `engines`). These publish a new version.
- `docs:` / `ci:` / `test:` / `chore:` — changes that are not part of the npm package
  (`skills/`, `docs/`, workflows, tests).

## Keep the CLI and the Agent Skill in sync

`skills/create-mcp-tools/SKILL.md` describes the CLI's flags, prompts, CI mode, side effects and
Node.js requirement. Whenever you change the CLI (`src/`, `template/`, `package.json` engines),
update the skill in the same pull request.

- The supported Node.js range lives in `src/node-version.ts` (`NODE_ENGINES_RANGE`).
  `test/node-version.test.mjs` fails if package.json `engines.node`, README.md or SKILL.md
  disagree with it.
- Validate the skill after editing it:
  `uvx --from skills-ref agentskills validate skills/create-mcp-tools`
- The docs site reads SKILL.md at build time and publishes it unchanged, so no copy needs to
  be updated.
