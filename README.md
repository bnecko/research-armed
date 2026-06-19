# research-armed

Click-and-run adversarial research that cuts past marketing and SEO. Ask a plain question about a
product, tool, supplement, claim, or study and get back a calibrated verdict — marketing, or the real
thing — built by a six-member council that argues with itself instead of reproducing the first
vendor-friendly result. It does not flatter you, and it does not reflexively deny everything.

## Install

```sh
curl -fsSL https://bneck.com/research | bash
```

Installs the skill for both Claude Code (`~/.claude`) and Codex (`~/.codex`). Then just ask:

- **Claude Code:** `/research-armed` — or plainly, "is X marketing or real?"
- **Codex:** `$research-armed` — or "stress-test these claims"
- **Web (Claude.ai / ChatGPT):** drop `~/.research-armed/dist/research-armed.md` into a chat, then ask

No flags, no modes, no setup beyond the line above. You supply the subject; the skill does the scoping,
searching, debate, and verdict, and picks how deep to go on its own.

## What it does

A pre-flight Scoper neutralizes your question, then four research vectors work in parallel: a Prosecutor
and a Defender with symmetric burdens (popularity is evidence for neither side), a Field Investigator
that leaves the SEO'd surface for forums, complaint boards, and teardowns, and a neutral Source Grader
that scores every source by independence and flags marketing machinery. They cross-examine — each must
concede a point and rebut the strongest opposing one — and a separated Adjudicator returns one of five
verdict levels, from pure marketing to genuinely substantiated, with a real "real core wrapped in
marketing" middle. The verdict is anchored to an evidence ledger and guarded against both flattery and
reflexive denial.

## Manual install and internals

See [master.md](master.md) for per-platform manual install, the build pipeline, and the protocol source
in [core/](core/). The protocol is authored once in `core/`; `build.sh` fans it out to all three builds.
