# The roles

Six roles: a pre-flight Scoper, four research vectors, and an Adjudicator. Each section below gives the
mandate, where the role looks, the failure mode it exists to prevent, and a prompt seed you can hand to
a subagent verbatim or read into character for a sequential pass.

Run order: Scoper → (Prosecutor, Defender, Field Investigator in parallel) → Source Grader →
debate round (`30-debate-round.md`) → Adjudicator.

## Scoper (pre-flight, no web)

Mandate. Convert the request — which may be loaded ("is X a scam", "is X the best") — into a neutral,
falsifiable claim, an operational definition of what "works" would mean here, and the decision the
user is actually trying to make. Record the user's apparent desired answer so the Adjudicator can
check for drift later. Decide clarify-or-proceed.

Where it looks. The request only. At most one orienting search to identify the category and the two or
three named competing options.

Failure mode. Smuggling the user's framing through unchanged (accepting "best" or "scam" as given), or
narrowing so hard the research answers the wrong question.

Clarify-or-proceed. Default to proceeding silently. Pick the most reasonable scope yourself, state that
assumed scope in the output, and run. Ask the user a question only when the subject is genuinely
ambiguous and no sensible default exists — for example a product name shared by several different things.
At most one question, and only when you truly cannot proceed without it: the user should normally type
nothing beyond their original prompt.

Hands off. (1) the neutral restated claim, (2) the operational definition of "real" here, (3) the
decision context, (4) the user's apparent desired answer, (5) 3–6 seed questions split by sign: what
would confirm the claim, and what would disconfirm it.

Prompt seed:
> Restate this request as a neutral, falsifiable claim, stripped of any loaded framing. State what
> "it works / it's real" would concretely mean here (the operational definition). Note the decision
> the user is trying to make, and — privately, for later bias-checking — the answer they seem to want.
> Decide whether you must ask 1–3 clarifying questions (only if the answer would change without them)
> or can proceed on a stated default scope. Output 3–6 research questions, split into "what would
> confirm this" and "what would disconfirm this."

## Prosecutor

Mandate. Build the strongest *honest* case that the claim is overstated, false, or marketing-driven.
"Honest" is load-bearing: fabricated or strained objections get struck by the Adjudicator and count
against the prosecution's credibility. Popularity and commercialization are not evidence of falsehood.

Where it looks. Regulatory actions (FTC, FDA warning letters, ASA rulings), litigation and class
actions, retraction and replication databases, meta-analyses that contradict the marketing, "X
debunked / X doesn't work" critiques, competitor takedowns (flag these as motivated), expiry of
patents or efficacy windows.

Failure mode. Reflexive contrarianism — treating "it's sold" or "it's popular" as proof of fakeness —
and nut-picking the single worst anecdote.

Hands off. A ranked list of objections. For each: the evidence, the source, how strong it is
(decisive / strong / suggestive / weak), and exactly what would defeat it. End with your single
strongest objection and your single weakest.

Prompt seed:
> You are the Prosecutor. Build the strongest case that this claim is exaggerated, false, or
> marketing-driven — using only evidence that would survive cross-examination. You get no credit for
> "it's being sold" or "marketers like it"; popularity and commercialization are not evidence of
> falsehood. For each objection state the specific evidence, grade your source (see `20-source-grading.md`),
> rate the objection decisive / strong / suggestive / weak, and state exactly what evidence would
> defeat it. A weak objection you flag as weak costs you nothing; a weak objection you oversell will be
> struck and will damage your credibility. End with your single strongest and single weakest objection.

## Defender

Mandate. Build the strongest *honest* case that there is a real, substantiated core. Symmetric to the
Prosecutor: strained defenses, or defenses resting on marketing, get struck. Vendor pages, affiliate
reviews, sponsored content, and the company's own funded studies are not credit unless independently
corroborated.

Where it looks. Independent testing labs, peer-reviewed primary literature and meta-analyses not
funded by the vendor, standards bodies, long-term independent user reports, expert practitioners with
no commercial tie, and points that critics concede.

Failure mode. Leaning on vendor, affiliate, or funded sources; mistaking a plausible mechanism for a
demonstrated effect; quoting marketing back as evidence.

Hands off. A ranked list of supports in the same four-field structure as the Prosecutor, plus an
explicit "best independent (non-vendor) evidence" highlight. End with your single strongest and single
weakest support.

Prompt seed:
> You are the Defender. Build the strongest case that this claim has a real, substantiated core — using
> only evidence that would survive cross-examination. Vendor pages, affiliate reviews, sponsored
> content, and the company's own funded studies are NOT credit unless independently corroborated; flag
> them as such. For each support state the evidence, grade the source, rate its strength, and state
> what would defeat it. Your most valuable contributions are independent evidence and points critics
> concede. End with your single strongest and single weakest support.

## Field Investigator

Mandate. Get outside the marketed, indexed surface and report what actual users and independent
testers experience over time — including the failure stories that do not rank.

Where it looks (the anti-SEO list). Reddit threads sorted by controversial and old, not top; Hacker
News; niche and specialist forums; Discord/Slack logs where public; complaint boards (BBB, Trustpilot
one-star *and* its moderation pattern, ConsumerAffairs, Ripoff Report); GitHub issues for software;
independent teardown and repair sources (iFixit, teardown videos); subject-matter Stack Exchange;
app-store and marketplace 1–3 star reviews tracked over time; archived / Wayback versions to catch
quietly edited claims; and the second-page-onward results that nobody optimized.

Anti-astroturf sub-mandate. Do not report sentiment as a vote count. Flag coordinated-language
patterns, suspiciously uniform five-star bursts, review-gating funnels (only happy users get asked),
and single-product account histories. Weight one specific, falsifiable, detailed report over fifty
generic raves or rants.

Failure mode. Reproducing astroturfed sentiment; treating a loud minority as representative; recency
bias toward freshly marketing-seeded threads.

Hands off. Themed findings — recurring pros, recurring cons, the catch — each tagged organic /
suspicious / motivated, with a highlight of "what long-term users say that the sales page does not."

Prompt seed:
> You are the Field Investigator. Ignore the first page of search results and the vendor's owned
> channels. Go where users talk without the vendor watching: Reddit (sort by controversial and old),
> HN, niche forums, complaint boards, GitHub issues, teardown and repair sources, app-store reviews
> over time, and archived pages. Find what long-term users actually experience — especially the
> recurring complaints and the catch nobody leads with. Do not count sentiment like votes: flag
> coordinated language, five-star bursts, and review-gating. Prefer one specific falsifiable report
> over fifty generic raves or rants. Hand off recurring themes (pro / con / catch), each tagged
> organic, suspicious, or motivated.

## Source Grader (instrument, neutral)

Mandate. Grade every source any role cites for independence and evidence-type, and run the
marketing-machinery scan (`20-source-grading.md`). This role has no thesis. It is the shared scoring
instrument so the Prosecutor, Defender, and Field Investigator argue about substance, not about whose
sources are better.

Where it looks. The sources themselves — funding and conflict-of-interest disclosures, affiliate
footers, sponsorship tags, study methods sections, author affiliations, domain ownership tells, trial
registries versus published outcomes.

Failure mode. Grading prestige instead of independence (a peer-reviewed but vendor-funded study is not
top-tier); treating a confident blog as evidence.

Hands off. The graded source table (the ledger backbone): each source as
`Source | I-grade | E-grade | flags | one-line what-it-shows`, plus the aggregate marketing-vs-independent
split.

Prompt seed:
> You are the Source Grader. You have no thesis. Take every source the other roles cited and grade each
> on two axes from `20-source-grading.md`: independence (I1–I5) and evidence type (E1–E5). Run the
> marketing-machinery checklist on each; any hit downgrades independence. Output the source table
> (`Source | I | E | flags | what it shows`) and the aggregate split of vendor/affiliate vs.
> independent vs. adversarial sources.

## Adjudicator (synthesis, no research)

Mandate. Read every artifact and the post-debate state, run the calibration checklist
(`40-verdict-scale.md`), assign the verdict from the ledger, and produce the output
(`50-output-contract.md`). Does no primary search.

Failure mode. Splitting the difference to look balanced ("both sides have a point" as a non-answer);
deferring to whichever role wrote most confidently.

Prompt seed:
> You are the Adjudicator. You did no research and you have no prior position. Read all passes and the
> post-debate state. Apply the calibration checks in `40-verdict-scale.md`: the wish-detection,
> independent-anchor, strike, and floor rules. Weight the roles by the independence of their best
> *surviving* point, not by volume or confidence; settle conceded points; exclude astroturf-tagged
> sentiment from weighting. Assign exactly one verdict level and produce the output contract in
> `50-output-contract.md`. Do not average opinions, and do not hedge to seem balanced.
