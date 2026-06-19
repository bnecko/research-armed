---
name: research-armed
description: Run an adversarial anti-marketing research council on a claim, product, study, or document. Use when the user wants marketing hype stress-tested against independent and field evidence, when they ask whether something is marketing or the real thing, or when they want a skeptical, evidence-graded verdict on a pitch, product page, supplement, tool, or study instead of the usual first-page SEO answer.
---

# Research-Armed (Codex)

Run a six-role adversarial council that cuts past marketing and SEO to a calibrated verdict: is this
claim marketing, or the real thing? Do not flatter the user and do not reflexively deny everything.

## Load the protocol

Read `reference/00-overview.md` first, then `reference/10-personas.md` and
`reference/50-output-contract.md`. Read `reference/20-source-grading.md`, `reference/30-debate-round.md`,
and `reference/40-verdict-scale.md` when you reach those phases.

## Orchestrate

First settle effort (see Effort below): ask the user Medium / High / Max unless they already signalled a
level — it sets how wide you search.

1. **Scope.** Act as the Scoper (`reference/10-personas.md`): restate the request as a neutral claim,
   record the user's apparent desired answer, and either proceed on a stated default scope or, only if
   genuinely ambiguous, ask one clarifying question.
2. **Check capability.** If you can start subagents, spawn one per research vector — Prosecutor,
   Defender, Field Investigator. Subagents start fresh and cannot read this skill's `reference/` files,
   so copy each vector's mandate (`reference/10-personas.md`), the grading rubric
   (`reference/20-source-grading.md`), and the chosen effort level and source target into its task
   prompt. At High and Max, also run one searcher per channel (`reference/00-overview.md`), several
   queries each past page one, dedupe by URL to the target, and hand that corpus to the vectors. Collect
   the passes and run a Source Grader pass over the corpus. **If subagents are unavailable, do the same
   sweep and vectors yourself, sequentially, reading the reference files directly.** The output is
   identical; only the executor changes.
3. **Debate.** Run the round in `reference/30-debate-round.md`. You are the orchestrator: collect each
   pass, compile the digest with contradictions named, relay it back, and collect rebuttals. The roles
   never talk to each other directly — every exchange goes through you.
4. **Adjudicate.** Act as the Adjudicator (`reference/40-verdict-scale.md`): apply the calibration
   checks, assign one verdict level, and produce the output in the shape of
   `reference/50-output-contract.md`.

## Web research

Use web search and the browser plugin during the evidence passes; go past the first page and grade
every source with `reference/20-source-grading.md`. With no access, reason from the provided material,
add an EVIDENCE GAPS note, and cap confidence at Medium.

## Effort

Before researching, ask the user one question: which effort level — Medium, High, or Max? Skip the ask
only if they already named or signalled one ("quick/deep/heavy/exhaustive/max"); an explicit "heavy" or
"max" overrides everything, even on a trivial task. Definitions and the search-channel list are in
`reference/00-overview.md`: Medium ≈ 30–60 sources examined, High ≈ 300+ across all channels, Max ≈ 600+
loop-until-dry. At High and Max, fan out across the channels (subagents if available, else many
sequential searches), dedupe to the target, then run the adversarial layer over that corpus.
