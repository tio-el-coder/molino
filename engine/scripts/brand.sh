#!/bin/bash
# brand.sh — invoke Claude with a specific brand's full design context loaded
#
# Usage:
#   ./engine/scripts/brand.sh brand-a "build a landing page for the summer campaign"
#   ./engine/scripts/brand.sh brand-b "write a creative brief for their product launch"
#   ./engine/scripts/brand.sh brand-a "refresh tokens from Figma"
#
# Make executable once: chmod +x engine/scripts/brand.sh

BRAND=$1
shift
PROMPT="$@"

# Preflight: require the Claude Code CLI to be installed.
# molino does NOT bundle an LLM — it loads brand context and hands it to `claude`.
if ! command -v claude >/dev/null 2>&1; then
  echo "❌ Claude Code CLI not found on your PATH."
  echo ""
  echo "   molino is the engine — it loads brand context, but Claude is what builds."
  echo "   Install it: https://claude.com/claude-code"
  echo "   Then authenticate: \`claude login\`"
  echo ""
  echo "   You'll also want the Figma MCP server connected so the engine can"
  echo "   read & write Figma. See README.md → Prerequisites."
  exit 127
fi

if [ -z "$BRAND" ]; then
  echo "❌ Usage: ./engine/scripts/brand.sh [brand-name] \"your prompt\""
  echo "   Available brands:"
  ls brands/ 2>/dev/null || echo "   (none yet — run \`./bin/molino init <brand>\` first)"
  exit 1
fi

BRAND_DIR="brands/$BRAND"

if [ ! -d "$BRAND_DIR" ]; then
  echo "❌ Brand not found: $BRAND_DIR"
  echo "   Available brands:"
  ls brands/
  exit 1
fi

echo "🎨 Loading design OS for: $BRAND"
echo "📚 Engine: frontend-design + ui-animation"
echo "🏷  Brand:  figma-design-system + design-taste + design-director"
echo ""

claude "
You are operating as the Design OS for $BRAND.

STEP 1 — Load the shared engine skills:
- Read engine/skills/frontend-design.md
- Read engine/skills/ui-animation.md

STEP 2 — Load the brand context:
- Read $BRAND_DIR/figma-design-system.md (tokens, colors, type — source of truth)
- Read $BRAND_DIR/design-taste.md (aesthetic direction)
- Read $BRAND_DIR/design-director.md (brand strategy and voice)

STEP 3 — Execute the following request using the loaded context:
$PROMPT

All outputs go to outputs/$BRAND/. Reference brand tokens only — never generic values.
"
