#!/usr/bin/env bash
# Remote bootstrap for: curl -fsSL https://bneck.com/research | bash
# Clones or updates bnecko/research-armed, then runs its installer.
set -euo pipefail

REPO="https://github.com/bnecko/research-armed.git"
DEST="${RESEARCH_ARMED_HOME:-$HOME/.research-armed}"

if ! command -v git >/dev/null 2>&1; then
  echo "research-armed: git is required. Install git and re-run." >&2
  exit 1
fi

if [ -d "$DEST/.git" ]; then
  echo "updating $DEST"
  git -C "$DEST" pull --ff-only --quiet || { echo "re-cloning"; rm -rf "$DEST"; git clone --depth 1 --quiet "$REPO" "$DEST"; }
else
  echo "cloning into $DEST"
  git clone --depth 1 --quiet "$REPO" "$DEST"
fi

exec "$DEST/install.sh"
