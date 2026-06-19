---
name: research-armed
description: Run an adversarial anti-marketing research council on a claim, product, study, or document. Use when the user wants marketing hype stress-tested against independent and field evidence, when they ask whether something is marketing or the real thing, or when they want a skeptical, evidence-graded verdict (marketing vs. the real thing) on a pitch, product page, supplement, tool, or study instead of the usual first-page SEO answer.
allowed-tools: Task, WebSearch, WebFetch, Read
user-invocable: true
disable-model-invocation: false
---

# Research-Armed (Claude Code)

Run a six-role adversarial council that cuts past marketing and SEO to a calibrated verdict: is this
claim marketing, or the real thing? Do not flatter the user and do not reflexively deny everything.

## Load the protocol

Read `reference/00-overview.md`, `reference/10-personas.md`, `reference/20-source-grading.md`, and
`reference/50-output-contract.md`; read `reference/30-debate-round.md` and `reference/40-verdict-scale.md`
when you reach those phases. Spawned subagents start in a fresh context and cannot resolve this skill's
relative paths, so you read the protocol and hand each subagent the text it needs in its task prompt —
never just a path.

## Orchestrate with subagents

First settle effort (see Effort below): ask the user Medium / High / Max unless they already signalled a
level — it sets how wide you fan out.

1. **Scope.** Act as the Scoper (`reference/10-personas.md`): restate the request as a neutral claim,
   record the user's apparent desired answer, and either ask 1–3 clarifying questions or proceed on a
   stated default scope.
2. **Fan out.** Spawn three research vectors in parallel via the Task tool — `ra-prosecutor`,
   `ra-defender`, `ra-field-investigator`. In each task prompt include the target material, the scoped
   claim, the chosen effort level and its source target, that vector's mandate section copied from
   `reference/10-personas.md`, and the grading rubric from `reference/20-source-grading.md`. At High and
   Max, also fan out one searcher per channel (`reference/00-overview.md`) — several queries each, past
   page one — collect candidate sources, dedupe by URL to the target, and hand that corpus to the
   vectors. Collect all passes.
3. **Grade.** Spawn `ra-source-grader` with the three passes and the `reference/20-source-grading.md`
   rubric copied inline, to consolidate the evidence ledger and run the marketing-machinery scan.
4. **Debate.** Run the round in `reference/30-debate-round.md`. You are the orchestrator: compile the
   digest with contradictions named, relay it to each vector (re-spawn each with the digest inline), and
   collect rebuttals. Subagents cannot message each other — every exchange goes through you.
5. **Adjudicate.** Spawn `ra-adjudicator` with every pass, the graded ledger, the rebuttals, and the
   verdict scale and output contract (`reference/40-verdict-scale.md`, `reference/50-output-contract.md`)
   copied inline, to apply the calibration checks and produce the output.

## Degradation

If subagents are unavailable or fail, run the vectors yourself, sequentially, each as a labelled
in-character pass — same protocol, same output, only the executor changes. With no web access, reason
from the provided material, add an EVIDENCE GAPS note, and cap confidence at Medium.

## Effort

Before researching, ask the user one question: which effort level — Medium, High, or Max? Skip the ask
only if they already named or signalled one ("quick/deep/heavy/exhaustive/max"); an explicit "heavy" or
"max" overrides everything, even on a trivial task. Definitions and the search-channel list are in
`reference/00-overview.md`: Medium ≈ 30–60 sources examined, High ≈ 300+ across all channels, Max ≈ 600+
loop-until-dry.

At High and Max, spawn several parallel searchers across the channels (not just the three vectors),
dedupe by URL to the target before grading, then run the adversarial layer over that corpus. For a
deterministic high-volume run, invoke the Workflow `workflow/research-armed.workflow.js` with the effort
in args (`{claim: "…", effort: "high"}` or `"max"`) — it fans out the channel sweep, loops to the
target, and returns a schema-validated verdict.
