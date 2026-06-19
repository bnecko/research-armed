#!/usr/bin/env bash
# One-command setup: build the artifacts, then install the Claude Code and Codex skills.
# The web build needs no install — it is a single file you drop into a chat.
set -euo pipefail
cd "$(dirname "$0")"

./build.sh >/dev/null
echo "built artifacts."

claude_home="${CLAUDE_HOME:-$HOME/.claude}"
codex_home="${CODEX_HOME:-$HOME/.codex}"

mkdir -p "$claude_home/skills" "$claude_home/agents"
rm -rf "$claude_home/skills/research-armed"
cp -R claude-code/.claude/skills/research-armed "$claude_home/skills/"
cp claude-code/.claude/agents/ra-*.md "$claude_home/agents/"
echo "installed Claude Code skill -> $claude_home/skills/research-armed"

if [ -d "$codex_home" ]; then
  mkdir -p "$codex_home/skills"
  rm -rf "$codex_home/skills/research-armed"
  cp -R codex/skills/research-armed "$codex_home/skills/"
  echo "installed Codex skill       -> $codex_home/skills/research-armed"
else
  echo "skipped Codex: no $codex_home (install Codex, or set CODEX_HOME, then rerun)"
fi

echo ""
echo "ready. just ask:"
echo "  Claude Code : /research-armed   (or 'is X marketing or real?')"
echo "  Codex       : \$research-armed   (or 'stress-test these claims')"
echo "  Web         : drop $(pwd)/dist/research-armed.md into a chat, then ask"
