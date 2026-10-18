import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { APIRoute } from 'astro';
import { loadSkills } from '../lib/skills';

// The CLI's package.json (repository root) is the source of the Node.js requirement.
const cliPackage = JSON.parse(readFileSync(resolve(process.cwd(), '..', 'package.json'), 'utf-8'));

// https://llmstxt.org/ : H1, blockquote summary, details, then H2 sections of link lists.
export const GET: APIRoute = () => {
  const skillLinks = loadSkills()
    .map((skill) => `- [${skill.name} Agent Skill](${skill.url}): ${skill.description}`)
    .join('\n');

  const body = `# create-mcp-tools

> create-mcp-tools is a command line tool that scaffolds a TypeScript MCP (Model Context Protocol) server project, then optionally runs npm install, creates an initial git commit and registers the server in Claude.app.

- Run it with \`npx create-mcp-tools <directory> --name <name> --description "<description>"\`. With \`npm create mcp-tools\`, put the options after \`--\`; otherwise npm does not forward them.
- Requires Node.js ${cliPackage.engines.node}.
- When an agent runs it without a TTY, set \`CI=1\`: there are no prompts, npm install and git initialization always run, and Claude.app's config is never modified.
- \`npx create-mcp-tools --help\` describes every option, prompt and side effect.

## Agent Skills

The Agent Skill below tells coding agents how to run the CLI safely: check prerequisites, show a plan and get the user's approval before creating anything, run with \`CI=1\`, then verify the result. Install it with \`npx skills add hideokamoto/create-mcp-server\`.

${skillLinks}
- [/skill.md](/skill.md): The same SKILL.md at a short URL
- [Agent Skills discovery index](/.well-known/agent-skills/index.json): Lists the skills with their URL and sha256 digest

## Docs

- [README](https://raw.githubusercontent.com/hideokamoto/create-mcp-server/main/README.md): Requirements, usage, the full \`--help\` output and the Agent Skill install command
- [Contributor guide for agents](https://raw.githubusercontent.com/hideokamoto/create-mcp-server/main/AGENTS.md): Repository layout, checks, commit conventions

## Optional

- [npm package](https://www.npmjs.com/package/create-mcp-tools)
- [GitHub releases](https://github.com/hideokamoto/create-mcp-server/releases)
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
