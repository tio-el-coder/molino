# figma-sync (agent)

> Reads and writes to Figma via MCP. Extracts variables, syncs tokens, pushes components.

## Invocation
```bash
./engine/scripts/brand.sh brand-a "sync tokens from Figma"
./engine/scripts/brand.sh brand-b "push updated design tokens to Figma"
```

## Workflow — pull (Figma → local)

1. Read `brands/[brand]/.env` for `FIGMA_FILE_KEY`
2. Run `node engine/scripts/extract-tokens.js --brand [brand]`
3. Writes to:
   - `brands/[brand]/tokens/tokens.json`
   - `brands/[brand]/tokens/variables.css`
4. Report changes: new tokens, modified values, removed tokens

## Workflow — push (local → Figma)

1. Read `brands/[brand]/tokens/tokens.json`
2. Compare with current Figma variables via REST API
3. Apply only diffs — never overwrite unchanged values
4. Report: tokens pushed, tokens skipped, any conflicts

## When to sync

- After any Figma variable change → pull to keep local tokens current
- After a major website build → push any new semantic aliases back to Figma
- Before a client presentation → pull to ensure everything is up to date

## Figma MCP tools available

- `Figma:get_variable_defs` — read variables for a node
- `Figma:use_figma` — run JavaScript in Figma (read/write anything)
- `Figma:search_design_system` — search components, styles, variables
