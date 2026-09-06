# AniList MCP — local fork

A locally maintained AniList Model Context Protocol server for personal use. This fork is based on [yuna0x0/anilist-mcp](https://github.com/yuna0x0/anilist-mcp) and uses AniList's GraphQL API directly for authenticated list mutations.

This iteration is built and run locally so the owner controls the source, fixes, dependencies, and runtime path. It is not distributed through a package registry.

## Why this fork uses native GraphQL

The upstream list wrapper rejected valid nested AniList inputs with `Provided object has a nested value!`. This fork sends list mutations directly to AniList GraphQL, so nested dates and other supported inputs are handled by AniList itself instead of the stale serializer.

## Requirements

- Node.js 18 or newer
- An AniList API token for account actions
- A local MCP client such as Hermes Agent

## Build locally

```bash
git clone https://github.com/ziwei531/anilist-mcp.git
cd anilist-mcp
pnpm install --frozen-lockfile
pnpm build
```

The built server is `dist/index.js`. It is run with Node.js from this checkout; no registry installation is involved.

## Configure a local MCP client

Point the client at the built file and provide the token through the environment:

```json
{
  "mcpServers": {
    "anilist": {
      "command": "node",
      "args": ["/absolute/path/to/anilist-mcp/dist/index.js"],
      "env": {
        "ANILIST_TOKEN": "your_anilist_token"
      }
    }
  }
}
```

Keep the token outside the repository. Create one at [AniList Developer Settings](https://anilist.co/settings/developer).

## Verify

```bash
hermes mcp test anilist
```

A successful check should connect to the local server and discover its tools. For other MCP clients, use their equivalent connection or inspector check.

## Update the local fork

```bash
cd anilist-mcp
git pull origin main
pnpm install --frozen-lockfile
pnpm build
```

Restart or reload the MCP client after rebuilding so it launches the new `dist/index.js` process.

## Copy-paste setup request for an LLM

```text
Help me set up my own local AniList MCP server from https://github.com/ziwei531/anilist-mcp.git.

Do not install a registry package or use a remote deployment. Clone the repository, install its locked dependencies locally with pnpm, build dist/index.js, and configure my MCP client to run that local file with ANILIST_TOKEN supplied through the environment. Keep the token out of files and chat output. Verify the server by connecting to it and listing its tools. Read the repository README first and report the exact local path and verification result.
```

## Legacy documentation

The upstream README is preserved at [`docs/legacy/README.legacy.md`](docs/legacy/README.legacy.md) for reference. It describes the original published and cloud-deployment workflow, which is not the intended workflow for this fork.

## License

This project remains licensed under the MIT License. See [LICENSE](LICENSE).
