# create-typescript-server ![NPM Version](https://img.shields.io/npm/v/%40modelcontextprotocol%2Fcreate-server)

A command line tool for quickly scaffolding new MCP (Model Context Protocol) servers. This is a public fork of [@modelcontextprotocol/create-server](https://www.npmjs.com/package/@modelcontextprotocol/create-server), maintained with the latest SDK updates and improvements.

## Getting Started

```bash
# Create a new server in the directory `my-server`
npm create mcp-tools my-server

# With options
npm create mcp-tools my-server --name "My MCP Server" --description "A custom MCP server"
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

```bash
% npm create mcp-tools --help
Create a package.json file

Usage:
npm init <package-spec> (same as `npx <package-spec>`)
npm init <@scope> (same as `npx <@scope>/create`)

Options:
[--init-author-name <name>] [--init-author-url <url>] [--init-license <license>]
[--init-module <module>] [--init-version <version>] [-y|--yes] [-f|--force]
[--scope <@scope>]
[-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
[-ws|--workspaces] [--no-workspaces-update] [--include-workspace-root]

aliases: create, innit

Run "npm help init" for more info
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
