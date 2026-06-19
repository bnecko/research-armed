# Research-Armed: the anti-marketing research council

Most research — human or AI — catches the first vendor-friendly, well-ranked answer and reproduces
it. That answer is usually what a marketing team wrote and a SEO team pushed to the top. This protocol
does the opposite: it runs a small council of researchers with deliberately opposed mindsets, makes
them argue, grades every source by who benefits from it, and returns one calibrated verdict — is this
claim marketing, or the real thing?

The protocol is defined as roles producing written artifacts. Whether each role is a separate agent or
the same model writing one section after another does not matter: every role reads the *artifacts* of
the roles before it, never a live conversation. If you can carry text from one step to the next, you
can run this.

## The council

- **Scoper** — pre-flight. Turns the request into a neutral, falsifiable claim and decides whether to
  ask a clarifying question or proceed. Does no web research.
- **Prosecutor** — builds the strongest honest case that the claim is overstated or marketing.
- **Defender** — builds the strongest honest case that there is a real, substantiated core.
- **Field Investigator** — leaves the marketed surface and reports what long-term users and independent
  testers actually experience.
- **Source Grader** — a neutral instrument, not an advocate. Grades every source the others cite and
  runs the marketing-machinery scan.
- **Adjudicator** — reads everything, runs the calibration checks, and assigns the verdict. Does no
  research.

Full mandates and the per-role prompt seeds are in `10-personas.md`. They are written so a real
subagent and a role-played voice execute them identically.

## Two rules that make it work

1. **No role both researches and judges.** The Prosecutor and Defender never assign the verdict; the
   Adjudicator never does primary research. A researcher who graded its own thesis would fall in love
   with it.
2. **Everything is a ledger entry.** No claim counts unless it lands in the evidence ledger with a
   source and a grade (`20-source-grading.md`). The prose is scaffolding; the ledger is the spine, and
   the verdict is a function of the ledger, not of how confidently anyone wrote.

The Prosecutor and Defender get identical instructions with the sign flipped. Calibration — neither
flattering the user nor reflexively denying everything — comes from that symmetry plus the explicit
guardrails in `40-verdict-scale.md`, not from telling the model to "be balanced."

## The verdict

A five-level scale from **V1 pure marketing** to **V5 genuinely substantiated**, with a real honest
middle — **V3, a real core wrapped in marketing**. The verdict is the level whose evidence criteria
are actually met, plus the specific evidence that would move it up or down. Definitions and the
anti-flattery / anti-denial checks live in `40-verdict-scale.md`; the output shape in `50-output-contract.md`.

## Effort: ask first — Medium, High, or Max

Before researching, ask the user one question: which effort level — Medium, High, or Max? Skip the
question only when they already named or signalled a level ("quick", "deep", "heavy", "exhaustive",
"max"), and an explicit instruction to go heavy overrides everything — run heavy even on a small task.

- **Medium.** Fast calibrated read: ~30–60 sources examined, ~12–20 cited. The three vectors, one
  debate round. Minutes.
- **High.** Broad sweep: 300+ sources examined, ~30–50 cited. Work the full channel list below, several
  queries per channel, dedupe to the target before grading. One debate round (a second only if a
  decisive contradiction is still live).
- **Max.** Exhaustive: 600+ sources, loop-until-dry — keep sweeping each channel until two consecutive
  rounds surface nothing new. ~50–80 cited, two debate rounds where contradictions remain.

Volume feeds the independence filter; it does not replace it. Scanning 300 vendor pages and citing them
is the exact failure this tool exists to prevent. Cast wide to FIND the rare independent and adversarial
sources, then cite the load-bearing ones; the marketing-saturated bulk shows up only as the
marketing-vs-independent split.

### Search channels — work them all at High and Max

Regulators and legal (FTC, FDA, ASA, NAD, court filings, recalls); systematic reviews and meta-analyses
(Cochrane, PubMed); primary trials and preprints; standards bodies and professional associations;
independent testing labs and consumer orgs (Wirecutter, Consumer Reports, Which?, Stiftung Warentest);
Reddit / Hacker News / specialist forums (sort by controversial and old); complaint and return boards
(BBB, Trustpilot, ConsumerAffairs, PissedConsumer); teardown and repair (iFixit, repair forums);
competitor claims and comparison filings; investigative and trade press; replication and retraction
databases; and the second-page-onward long tail nobody optimized.

Auto-escalation: if even a wide sweep finds no independent (I4+) source either way, say so and mark the
space *"marketing-saturated — low independent signal."* The absence of independent evidence is itself a
finding.

Run on the user's plain question: confirm effort, scope it yourself (`10-personas.md`), sweep, debate
(`30-debate-round.md`), and adjudicate.
