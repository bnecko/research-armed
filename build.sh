#!/usr/bin/env bash
# Fan the single source of truth (core/ + shells/) out into the three builds.
# Hand-edit core/, shells/, the agent files, and openai.yaml — never the generated outputs.
set -euo pipefail
cd "$(dirname "$0")"

core_files=(core/[0-9]*.md)
web=dist/research-armed.md
codex_skill=codex/skills/research-armed
cc_skill=claude-code/.claude/skills/research-armed

# Web build: one self-contained file = web shell + every core partial, blank-line separated.
# The shell starts with a '#' heading so no stray '---' can be misread as frontmatter.
{
  cat shells/web-shell.md
  for f in "${core_files[@]}"; do printf '\n\n'; cat "$f"; done
} > "$web"

# Codex and Claude Code skills: shell becomes SKILL.md; core/ is copied into reference/.
cp shells/codex-shell.md "$codex_skill/SKILL.md"
cp shells/claude-code-shell.md "$cc_skill/SKILL.md"

for ref in "$codex_skill/reference" "$cc_skill/reference"; do
  rm -f "$ref"/*.md
  cp "${core_files[@]}" "$ref/"
done

echo "built:"
echo "  $web"
echo "  $codex_skill/SKILL.md (+ reference/)"
echo "  $cc_skill/SKILL.md (+ reference/)"
