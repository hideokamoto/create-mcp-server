---
name: create-mcp-tools
description: Scaffold a new TypeScript MCP (Model Context Protocol) server project with the create-mcp-tools CLI (`npx create-mcp-tools` / `npm create mcp-tools`). Use this skill whenever the user wants to create, bootstrap or scaffold a new MCP server, start a Node.js/TypeScript server that exposes MCP tools, resources or prompts, or asks how create-mcp-tools options, prompts or CI mode behave, even if they do not name the CLI.
license: MIT
compatibility: Requires Node.js ^18.17.0 || >=20.1.0, npm and git, plus network access to the npm registry.
---

# create-mcp-tools

`create-mcp-tools` generates a TypeScript MCP server project (an `McpServer` with an example
notes resource, a `create_note` tool and a `summarize_notes` prompt) from a template, then
optionally installs dependencies, creates a git commit and registers the server in Claude.app.

Running it changes things outside the conversation: it creates a directory, downloads packages
from the npm registry, creates a git commit and, in interactive mode, can edit Claude.app's
config file. So the workflow below is: check prerequisites, show the user exactly what will
happen, run only after they approve, then verify the result.

## Prerequisites

Check these before proposing a run. Each one maps to a concrete failure:

- **Node.js `^18.17.0 || >=20.1.0`** (`node -v`). The CLI copies the template with
  `fs.readdir(..., { recursive: true })`, added in v18.17.0 and v20.1.0 (never in v19). The CLI
  refuses to start on other versions.
- **npm** on `PATH`. The CLI runs `npm install` in the new directory.
- **git** with a user identity (`git config user.name` and `git config user.email`). Without
  one, `git commit` fails; the CLI reports the failure but still exits with code 0.
- **The target directory must not exist, but its parent must.** The CLI exits with code 1 if
  the directory already exists, and it creates only the last path segment (non-recursive
  `mkdir`), so `a/b/my-server` fails with `ENOENT` when `a/b` is missing. Propose
  `mkdir -p <parent>` as part of the plan in that case.
- **Network access to the npm registry**, for `npx` to fetch the CLI and for `npm install`.

## Steps

### 1. Collect the inputs

- `directory`: where to create the project (relative to the current directory).
- `--name`: defaults to the directory's basename. It becomes the package.json `name` and `bin`
  key, the `McpServer` name and the Claude.app config key. Suggest a valid npm package name:
  lowercase, no spaces or other non-URL-safe characters, at most 214 characters (npm's
  package.json `name` rules). The CLI does not validate it.
- `--description`: defaults to `"A Model Context Protocol server"`.

These values come from the user and are put on a shell command line, so quote them as data:

- Write every value as a single-quoted shell word (`'my-server'`). Inside single quotes nothing
  is expanded; a literal `'` in a value is written as `'\''`. Double quotes are not enough:
  `$(...)` and backticks still run inside them.
- Prefer to reject rather than escape for `directory` and `--name`: ask for another value
  unless it matches `^[A-Za-z0-9._@/-]+$` and does not start with `-`. Those two have no
  legitimate need for spaces or shell syntax.
- Keep `--` before the directory in `test` commands (`test -e -- '<directory>'`) so that a value
  is never read as an option.

### 2. Dry run: show the plan and get approval

The CLI has no dry-run flag. Do the read-only checks yourself and present the plan instead:

1. Confirm the prerequisites above, that `directory` does not exist (`test -e -- '<directory>'`) and
   that its parent does (`test -d -- "$(dirname -- '<directory>')"`).
2. Optionally show the CLI's own help, which describes the current behavior:
   `npx -y create-mcp-tools@latest --help` (this only downloads the CLI into the npm cache).
3. Tell the user exactly what the real run will do:
   - create `<directory>/` with `package.json`, `tsconfig.json`, `README.md`, `.gitignore` and
     `src/index.ts`
   - run `npm install` there (downloads dependencies; the `prepare` script also builds
     `build/index.js`)
   - run `git init`, `git add .` and `git commit -m "initialize"` there
   - not touch Claude.app's config (step 3 runs with `CI=1`)
4. Run the real command only after the user approves it.

### 3. Run

```bash
CI=1 npx -y create-mcp-tools@latest '<directory>' --name '<name>' --description '<description>'
```

`<directory>`, `<name>` and `<description>` stand for the single-quoted values from step 1.

- `CI=1` (or `CI=true`) is required when an agent runs the CLI. Without a TTY, the interactive
  prompts cannot be answered and the process aborts (exit code 130) before creating anything.
  In CI mode there are no prompts, `npm install` and git initialization always run, and
  Claude.app's config is never modified.
- `-y` stops npx from asking before it installs the CLI. npm also assumes `--yes` when stdin is
  not a TTY or a CI environment is detected.
- With `npm create mcp-tools` instead of `npx`, put the CLI's options after `--`
  (`npm create mcp-tools@latest '<directory>' -- --name '<name>'`). Without `--`, npm does not
  forward `--name` / `--description` and the defaults are used silently.

### 4. Verify

The exit code is not enough: failures of `npm install` and git initialization are only printed.
Check:

- the output has no `Failed to run npm install` or git failure messages
- `<directory>/src/index.ts` and `<directory>/build/index.js` exist
- `git -C <directory> log --oneline` shows the `initialize` commit

If `npm install` failed, fix the cause and run `npm install` in the directory. If the commit
failed because git has no identity, ask the user which identity to use; do not invent one.

### 5. Optional: register the server in Claude.app

Only do this when the user asks for it, because it edits a file outside the project. The
interactive CLI writes this entry, which you can reproduce after the user approves:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "<name>": {
      "command": "node",
      "args": ["<absolute path to directory>/build/index.js"]
    }
  }
}
```

Show the user the change first, keep every other key in the file, and ask before replacing an
existing `mcpServers.<name>` entry.

### 6. Next steps for the user

In the generated project: `npm run build` (or `npm run watch`) to compile, and
`npm run inspector` to try the server in the MCP Inspector.

## Safety rules

- Never run the real command, edit Claude.app's config or replace an existing entry without the
  user's approval of the plan from step 2.
- Never delete or overwrite an existing directory to make room for the project. Ask for another
  directory name instead.
- Do not set a git identity or change global git/npm config on the user's behalf.
