# create-typescript-server ![NPM Version](https://img.shields.io/npm/v/%40modelcontextprotocol%2Fcreate-server)

A command line tool for quickly scaffolding new MCP (Model Context Protocol) servers. This is a public fork of [@modelcontextprotocol/create-server](https://www.npmjs.com/package/@modelcontextprotocol/create-server), maintained with the latest SDK updates and improvements.

## Requirements

- Node.js `^18.17.0 || >=20.1.0`. The CLI copies the template with `fs.readdir(..., { recursive: true })`, which was added in Node.js v18.17.0 and v20.1.0; older versions would silently skip `src/index.ts`, so the CLI refuses to run on them.
- `npm` (used to install the generated project's dependencies) and `git` (used to create the initial commit), unless you decline those steps.

## Getting Started

```bash
# Create a new server in the directory `my-server`
npm create mcp-tools my-server

# With options (npm only forwards options that come after `--`)
npm create mcp-tools my-server -- --name my-server --description "A custom MCP server"

# Or run the CLI directly
npx create-mcp-tools my-server --name my-server --description "A custom MCP server"
```

After creating your server:

```bash
cd my-server     # Navigate to server directory
npm install      # Install dependencies

npm run build    # Build once
# or...
npm run watch    # Start TypeScript compiler in watch mode

# optional
npm link         # Make your server binary globally available
```

### CLI reference

`npm create mcp-tools --help` prints npm's own help for `npm init`. To see this CLI's help, run `npx create-mcp-tools --help` or `npm create mcp-tools -- --help`:

```text
Usage: create-mcp-tools [options] <directory>

Scaffold a new TypeScript MCP (Model Context Protocol) server project

Arguments:
  directory                        directory to create (must not exist yet)

Options:
  -n, --name <name>                server name (default: basename of
                                   <directory>; skips the name prompt)
  -d, --description <description>  server description (default: "A Model
                                   Context Protocol server"; skips the
                                   description prompt)
  -h, --help                       display help for command

Interactive prompts (skipped when CI=true or CI=1):
  - Server name, only when --name is not given (default: basename of <directory>)
  - Description, only when --description is not given
    (default: "A Model Context Protocol server")
  - Install for Claude.app, macOS and Windows only: adds
    { "command": "node", "args": ["<absolute path>/build/index.js"] } under
    "mcpServers.<name>" in claude_desktop_config.json, asking before replacing
    an existing entry with the same name
  - Run "npm install" in the new directory
  - Initialize a git repository (git init, git add ., git commit -m "initialize")

When CI=true or CI=1:
  No prompts. Missing name/description fall back to the defaults above,
  "npm install" and git initialization always run, and Claude.app config is
  never touched.

Notes:
  - The server name is used as the package.json "name" and "bin" key, the
    McpServer name in src/index.ts, and the Claude.app config key.
  - Exits with code 1 if <directory> already exists or the files cannot be
    created. Failures of "npm install", git initialization or the Claude.app
    config update are reported but do not change the exit code.
  - Requires Node.js ^18.17.0 || >=20.1.0.

Examples:
  $ npx create-mcp-tools my-server
  $ npx create-mcp-tools my-server --name my-server --description "My MCP server"
  $ npm create mcp-tools@latest my-server -- --name my-server

  With "npm create" / "npm init", put options after "--"; otherwise npm does
  not forward them to this command.
```

## Differences from the original

This fork includes:
- Updated MCP SDK to version 1.22.0
- Added Zod for input validation
- Modern API usage with `registerTool`, `registerPrompt`, and `registerResource`
- Regular maintenance and updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

## Recent Updates

### v1.0.0 - Breaking Changes (November 2025)

This is a **major version update** with breaking changes to align with the latest MCP SDK (v1.22.0).

**What's Changed:**

- **SDK Update**: Upgraded from `@modelcontextprotocol/sdk ^1.8.0` to `^1.22.0`
- **New API Methods**: Migrated to modern API methods:
  - `server.tool()` → `server.registerTool()`
  - `server.prompt()` → `server.registerPrompt()`
  - `server.resource()` → `server.registerResource()`
- **TypeScript Update**: Updated to TypeScript `^5.7.2`
- **Node Types Update**: Updated to `@types/node ^22.10.0`

**Migration Example:**

```typescript
// ❌ Old API (deprecated)
server.tool(
  "create_note",
  { title: z.string(), content: z.string() },
  async ({ title, content }) => { /* ... */ }
);

// ✅ New API (recommended)
server.registerTool(
  "create_note",
  {
    title: "Create Note",
    description: "Create a new note with a title and content",
    inputSchema: {
      title: z.string().describe("The title of the note"),
      content: z.string().describe("The content of the note")
    }
  },
  async ({ title, content }) => { /* ... */ }
);
```

**Why Breaking?**

The generated project code structure is completely different from previous versions. Projects created with v1.0.0+ will use the new `register*` APIs with structured configuration objects, providing better clarity and following the latest MCP best practices.

## Acknowledgments

- Original project: [@modelcontextprotocol/create-server](https://www.npmjs.com/package/@modelcontextprotocol/create-server)
