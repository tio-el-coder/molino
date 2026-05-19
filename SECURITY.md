# Security

molino is a local-first tool. Most of its risk surface lives on your machine: API tokens, brand context, and generated output. The defaults below keep that surface small. Read them before you run anything beyond `molino --help`.

## Threat model

molino is designed for **trusted local use** by the person who owns the Figma file. It is not a server, daemon, or hosted service. It does not:

- Run a network listener
- Send telemetry
- Read or write files outside the repo root
- Execute remote code

It **does**:

- Read your `FIGMA_TOKEN` from `brands/<brand>/.env` (gitignored)
- Make outbound HTTPS calls to `api.figma.com`
- Write generated files into `brands/` and `outputs/` (both gitignored)

## What's protected by default

| Concern | Protection |
| --- | --- |
| Secret leakage | `.env`, `.env.*` are gitignored. Only `.env.example` is ever committed. |
| Brand IP leakage | `brands/` and `outputs/` are gitignored. The engine repo never contains brand work. |
| Path traversal | `molino init` validates brand slugs (`^[a-z0-9-]+$`, no reserved names) and refuses to write outside the repo root. |
| Symlink swaps | `molino init` refuses to write through a symlinked `brands/<name>/` directory. |
| Malicious Figma URLs | Only `https://figma.com` and `https://www.figma.com` URLs are accepted; anything else is dropped. |
| Token in logs | `extract-tokens.js` never logs the value of `FIGMA_TOKEN`. |
| Supply chain | molino has **zero npm dependencies**. All CLI logic uses the Node.js standard library. |

## What you should still do

1. **Use a scoped Figma token.** Create a [personal access token](https://www.figma.com/developers/api#access-tokens) with the minimum scopes you need (read-only `file_content:read` if you only extract tokens).
2. **Rotate tokens regularly** and revoke them when you stop working on a brand.
3. **Never commit `brands/*/.env`.** The `.gitignore` blocks it, but check `git status` before pushing.
4. **Review LLM-generated output before shipping.** Claude is the primary builder — verify the code it writes, especially anything touching forms, auth, or third-party scripts.
5. **Don't pipe untrusted markdown into `brand.sh`.** The brand context files are read as instructions. If you didn't write them, treat them like code.

## Reporting a vulnerability

If you find a security issue in molino itself, please open a private security advisory on GitHub rather than a public issue:
https://github.com/tio-el-coder/molino/security/advisories/new

Include reproduction steps and the commit SHA. I aim to respond within 7 days.
