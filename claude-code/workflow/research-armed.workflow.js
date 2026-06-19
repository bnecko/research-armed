export const meta = {
  name: 'research-armed',
  description: 'Adversarial anti-marketing research council: parallel Prosecutor/Defender/Field vectors, neutral source grading, a cross-examination round, and a calibrated marketing-vs-real verdict.',
  phases: [
    { title: 'Research', detail: 'Prosecutor, Defender, and Field Investigator research in parallel' },
    { title: 'Grade', detail: 'neutral Source Grader builds the evidence ledger' },
    { title: 'Debate', detail: 'each vector concedes, rebuts the strongest opposing point, sharpens contradictions' },
    { title: 'Adjudicate', detail: 'calibrated verdict against the ledger' },
  ],
}

// This script inlines a condensed copy of the protocol because its agents run in fresh contexts and
// cannot read the skill's reference/ files. It is NOT produced by build.sh: when you change anything in
// core/, re-sync the grading rubric, verdict scale, and persona seeds below by hand.

// args is the thing under review: a string (claim/topic/pasted page) or {claim, material, mode}.
const target = typeof args === 'string' ? args : (args && (args.claim || args.material)) || ''
if (!target) throw new Error('research-armed: pass the claim, topic, or material to evaluate as args')
const deep = !!(args && (args.mode === 'deep' || args.deep))

const GRADING = `Grade every source on two axes. Independence: I1 vendor/affiliate/SEO-farm, I2 vendor-adjacent/sponsored, I3 mixed/unclear funding, I4 independent no-stake, I5 adversarial/incentivized-to-find-flaws. Evidence type: E1 assertion/mechanism-only, E2 specific anecdote, E3 observational/expert-consensus, E4 single RCT or large independent data, E5 replicated RCT/meta-analysis/independent head-to-head. Any marketing-machinery hit (affiliate links, sponsored, review-gating, astroturf, funded study with COI/outcome-switching/n<30, freshness gaming, comparison-table SEO, SERP capture by one owner, manufactured authority, edited claims) downgrades independence and is recorded as a flag. A claim is only as strong as its best independent source; five I1 sources never equal one I4. Popularity and commercialization are not evidence of falsehood.`

const VECTOR_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['findings', 'strongest', 'weakest'],
  properties: {
    findings: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['point', 'evidence', 'source', 'independence', 'evidenceType', 'strength', 'whatWouldDefeat'],
        properties: {
          point: { type: 'string' },
          evidence: { type: 'string' },
          source: { type: 'string' },
          independence: { type: 'string', enum: ['I1', 'I2', 'I3', 'I4', 'I5'] },
          evidenceType: { type: 'string', enum: ['E1', 'E2', 'E3', 'E4', 'E5'] },
          strength: { type: 'string', enum: ['decisive', 'strong', 'suggestive', 'weak'] },
          whatWouldDefeat: { type: 'string' },
        },
      },
    },
    strongest: { type: 'string' },
    weakest: { type: 'string' },
  },
}

const LEDGER_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['ledger', 'split'],
  properties: {
    ledger: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['source', 'independence', 'evidenceType', 'flags', 'shows'],
        properties: {
          source: { type: 'string' },
          independence: { type: 'string', enum: ['I1', 'I2', 'I3', 'I4', 'I5'] },
          evidenceType: { type: 'string', enum: ['E1', 'E2', 'E3', 'E4', 'E5'] },
          flags: { type: 'array', items: { type: 'string' } },
          shows: { type: 'string' },
        },
      },
    },
    split: { type: 'string', description: 'aggregate marketing-vs-independent split, e.g. "11 sources: 7 I1-I2, 2 I4, 1 I5, 1 I3"' },
  },
}

const REBUTTAL_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['concede', 'rebutStrongest', 'contradictions', 'updatedStrength'],
  properties: {
    concede: { type: 'string', description: 'at least one opposing point you now accept; must be non-empty' },
    rebutStrongest: { type: 'string', description: 'attack the STRONGEST opposing point, not a strawman' },
    contradictions: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['question', 'resolved', 'note'],
        properties: {
          question: { type: 'string', description: 'the contradiction as a decidable question' },
          resolved: { type: 'boolean' },
          note: { type: 'string' },
        },
      },
    },
    updatedStrength: { type: 'string' },
  },
}

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['level', 'oneSentence', 'claimScoped', 'whatsReal', 'whatsMarketing', 'theCatch', 'confidence', 'whatWouldChange', 'unresolved'],
  properties: {
    level: { type: 'string', enum: ['V1', 'V2', 'V3', 'V4', 'V5'] },
    oneSentence: { type: 'string' },
    claimScoped: { type: 'string' },
    whatsReal: { type: 'array', items: { type: 'string' } },
    whatsMarketing: { type: 'array', items: { type: 'string' } },
    theCatch: { type: 'string', description: 'the buried thing a buyer would most want to know; never empty' },
    confidence: { type: 'string', enum: ['High', 'Medium', 'Low'] },
    whatWouldChange: {
      type: 'object', additionalProperties: false, required: ['up', 'down'],
      properties: { up: { type: 'string' }, down: { type: 'string' } },
    },
    unresolved: { type: 'array', items: { type: 'string' } },
  },
}

const breadth = deep ? 'Search broadly, past the first page; exhaust your source list.' : 'Search the most load-bearing sources (about 5-12).'

const VECTORS = [
  { key: 'prosecutor', phase: 'Research', seed:
    `You are the Prosecutor. Build the strongest HONEST case that the claim is exaggerated, false, or marketing-driven, using only evidence that survives cross-examination. Look at regulator actions, litigation, retraction/replication databases, contrary meta-analyses, substantive debunks. ${breadth}` },
  { key: 'defender', phase: 'Research', seed:
    `You are the Defender. Build the strongest HONEST case that the claim has a real, substantiated core. Vendor/affiliate/funded sources are NOT credit unless independently corroborated. Prize independent evidence and points critics concede; a plausible mechanism is not a demonstrated effect. ${breadth}` },
  { key: 'field', phase: 'Research', seed:
    `You are the Field Investigator. Ignore the first page and the vendor's own channels. Go to Reddit (controversial/old), HN, niche forums, complaint boards, GitHub issues, teardowns, app-store reviews over time, archived pages. Report what long-term users actually experience and the catch nobody leads with. Do not count sentiment like votes; flag astroturf, five-star bursts, review-gating. Prefer one specific falsifiable report over many generic ones. ${breadth}` },
]

phase('Research')
const passes = await parallel(VECTORS.map(v => () =>
  agent(`${v.seed}\n\n${GRADING}\n\nTARGET UNDER REVIEW:\n${target}`,
    { label: `research:${v.key}`, phase: 'Research', schema: VECTOR_SCHEMA })))

const named = VECTORS.map((v, i) => ({ key: v.key, pass: passes[i] })).filter(x => x.pass)
const passDigest = named.map(x =>
  `### ${x.key}\nstrongest: ${x.pass.strongest}\nweakest: ${x.pass.weakest}\nfindings:\n` +
  x.pass.findings.map(f => `- [${f.independence}/${f.evidenceType} ${f.strength}] ${f.point} (src: ${f.source})`).join('\n')
).join('\n\n')

phase('Grade')
const ledger = await agent(
  `You are the neutral Source Grader. You have no thesis. ${GRADING}\n\nGrade every source cited below and output the evidence ledger plus the aggregate split.\n\n${passDigest}`,
  { label: 'grade:source-grader', phase: 'Grade', schema: LEDGER_SCHEMA })

const ledgerDigest = (ledger?.ledger || []).map(r =>
  `- ${r.source} | ${r.independence}/${r.evidenceType} | ${(r.flags || []).join(', ') || 'no flags'} | ${r.shows}`).join('\n')
const digest = `EVIDENCE LEDGER\n${ledgerDigest}\nSPLIT: ${ledger?.split || 'n/a'}\n\nVECTOR FINDINGS\n${passDigest}`

phase('Debate')
const rebuttals = await parallel(named.map(x => () =>
  agent(`You are the ${x.key} in cross-examination. Read the digest of all vectors and the graded ledger, then do exactly four things: (1) concede at least one opposing point you now accept (non-empty), (2) rebut the STRONGEST opposing point, not a strawman, (3) for each contradiction state it as a decidable question and resolve it with evidence or mark it unresolved, (4) update your strength rating. Agreement counts only if it survived the strongest objection.\n\n${digest}`,
    { label: `debate:${x.key}`, phase: 'Debate', schema: REBUTTAL_SCHEMA })))

const rebuttalDigest = named.map((x, i) => {
  const r = rebuttals[i]
  if (!r) return `### ${x.key}: (no rebuttal)`
  const cs = (r.contradictions || []).map(c => `  - ${c.resolved ? 'RESOLVED' : 'LIVE'}: ${c.question}${c.note ? ' — ' + c.note : ''}`).join('\n')
  return `### ${x.key}\nconcede: ${r.concede}\nrebut: ${r.rebutStrongest}\ncontradictions:\n${cs}\nupdated: ${r.updatedStrength}`
}).join('\n\n')

phase('Adjudicate')
const verdict = await agent(
  `You are the Adjudicator. You did no research and hold no prior position. Assign exactly one verdict level from the ledger, not from how confidently anyone wrote.\n\n` +
  `VERDICT SCALE: V1 pure marketing/unsupported (no I4+ support; best sources I1-I2; strongest objection stands). V2 mostly marketing, thin real kernel (small effect at I3-I4/E2-E3, narrower than marketed). V3 real core wrapped in marketing (>=1 I4/E3-E4 the critics concede, but scope/magnitude oversold) — the honest middle, a precise claim not a hedge. V4 substantiated, normal gloss (headline holds on I4+/E4). V5 genuinely substantiated/underrated (I4-I5/E4-E5 incl. adversarial sources).\n\n` +
  `CALIBRATION CHECKS — apply all: independent-anchor (no V4/V5 without an I4+ source); floor (no V1/V2 while an unrebutted I4+/E4 support stands); strike (discard machinery-driven, strawman, or "popularity therefore fake" objections); concession audit (a prosecution that conceded nothing is partially discounted). Weight roles by the independence of their best SURVIVING point, not volume. Exclude astroturf-tagged sentiment from weighting; use organic, specific field evidence as the real-world tiebreaker. "It depends" is allowed only inside V3 with the dependency scoped. If no I4+ source exists either way, return a provisional V1-V2 and set theCatch to note a marketing-saturated information space. theCatch must never be empty.\n\n` +
  `CLAIM UNDER REVIEW:\n${target}\n\n${digest}\n\nCROSS-EXAMINATION:\n${rebuttalDigest}`,
  { label: 'adjudicate', phase: 'Adjudicate', schema: VERDICT_SCHEMA })

return { verdict, ledger, rebuttals: rebuttalDigest }
