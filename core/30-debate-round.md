# The debate round

The roles do not message each other. On every platform — separate agents or one model writing in
sequence — the debate is mediated: the orchestrator collects each role's written pass, compiles a
digest, hands it back, and collects rebuttals. Because each step reads written artifacts, the same
procedure runs identically whether the roles are real subagents or role-played voices in one context.

## Round 1 — independent research, no peeking

The Prosecutor, Defender, and Field Investigator produce their passes without seeing each other. The
Source Grader then grades every cited source (or grades as the passes arrive).

In single-context mode this independence is fragile, so enforce it: instruct each role to write its
pass *before* reading any later instruction, and do not place the other roles' passes in context until
Round 2. A role that peeks contaminates the cross-examination.

## Digest A — compiled by the orchestrator

Produce a neutral, de-duplicated digest, stripped of rhetoric:

- each side's strongest two or three points, as plain claims with their source grades;
- the Field Investigator's themes, with the organic/suspicious/motivated tags;
- and — this is the part that does the work — **the direct contradictions, listed explicitly.**
  "Prosecutor says no replication exists; Defender cites replication Z. These conflict."

A contradiction that is not named will be smoothed over. Name every one.

## Round 2 — cross-examination

Hand each role the digest. Each must do exactly four things, in writing:

1. **Concede.** Name at least one opposing point you now accept. This is mandatory and must be
   non-empty — a role that concedes nothing is flagged as failing to engage. This is the valve against
   groupthink-by-stubbornness.
2. **Rebut the strongest.** Attack the *strongest* opposing point, not the weakest. Strawmanning is
   forbidden and will be struck.
3. **Resolve or sharpen each contradiction.** For every contradiction in the digest, either resolve it
   with evidence or sharpen it into a crisp, decidable question — "this reduces to: was study Z
   independently replicated, yes or no."
4. **Update your strength ratings** in light of the above.

## Anti-premature-consensus rules

State these to every role:

- Agreement counts only if it survived the strongest objection. If you agree, show that you considered
  and defeated the best counter.
- Disagreements are carried forward, not averaged. The Adjudicator must see the live disagreements; a
  contradiction that both sides went quiet on still goes into the output's unresolved-disagreements
  section.
- One round is the default. Run a second round only if a *decisive* contradiction is still live and
  would flip the verdict — deep mode only.

## Digest B — handed to the Adjudicator

Compile the post-cross-examination state: points now resolved, points conceded by each side, and the
contradictions that survived. The Adjudicator weighs this state, not the raw Round 1 passes.
