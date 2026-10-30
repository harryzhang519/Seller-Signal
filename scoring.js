// =====================================================================
// SCORING RULES  <-- change the points or thresholds here, nowhere else
// ---------------------------------------------------------------------
// Each rule has:
//   label   - what the rule is, shown on the page in "How scoring works"
//   points  - added to the score if the rule applies (negative = subtract)
//   reason  - the neutral phrase used in the one-sentence reason
//   applies - a tiny test: given a contact, does this rule apply? (true/false)
//
// Inputs are limited to home ownership, equity, contact history, and
// engagement with the agent. No life events or personal traits.
// =====================================================================

const SCORING_RULES = [
  { label: "Owned the home 7+ years",                 points: 25,  reason: "has owned the home 7+ years",      applies: (c) => c.yearsOwned >= 7 },
  { label: "Estimated equity gain of 40% or more",    points: 20,  reason: "has high estimated equity",        applies: (c) => c.equityGainPct >= 40 },
  { label: "Asked about home prices (last 90 days)",  points: 30,  reason: "recently asked about home prices", applies: (c) => c.engagement.includes("asked_about_prices") },
  { label: "Opened a market report (last 90 days)",   points: 15,  reason: "recently opened a market report",  applies: (c) => c.engagement.includes("opened_market_report") },
  { label: "Contacted within the last 6 months",      points: 10,  reason: "was in touch recently",            applies: (c) => c.monthsSinceContact <= 6 },
  { label: "No contact in 12+ months",                points: -10, reason: "has had no contact in over a year", applies: (c) => c.monthsSinceContact >= 12 },
];

// Shark Tank hand-off: a warm contact (decent score) that has gone
// untouched too long could be offered back to the lead pool.
const SHARK_TANK = { minScore: 50, minMonthsSinceContact: 12 };

// Turns ["a", "b", "c"] into "a, b, and c" so reasons read naturally.
function joinList(items) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return items[0] + " and " + items[1];
  return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
}

// Builds the one-sentence reason from the rules that applied.
// It only ever uses the neutral phrases above, never raw data or notes.
function buildReason(appliedRules) {
  const positives = appliedRules.filter((r) => r.points > 0).map((r) => r.reason);
  const negatives = appliedRules.filter((r) => r.points < 0).map((r) => r.reason);

  let sentence = positives.length > 0 ? joinList(positives) : "shows no strong signals right now";
  if (negatives.length > 0) sentence += ", but " + joinList(negatives);

  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

// Scores one contact. Opted-out contacts are skipped entirely.
function scoreContact(contact) {
  if (contact.optedOut) {
    return { contact, score: null, reason: "Opted out. Not scored or contacted.", sharkTank: false };
  }

  const appliedRules = SCORING_RULES.filter((rule) => rule.applies(contact));
  const total = appliedRules.reduce((sum, rule) => sum + rule.points, 0);
  const score = Math.max(0, Math.min(100, total)); // keep it between 0 and 100

  const sharkTank =
    score >= SHARK_TANK.minScore &&
    contact.monthsSinceContact >= SHARK_TANK.minMonthsSinceContact;

  return { contact, score, reason: buildReason(appliedRules), sharkTank };
}

// Scores everyone and sorts highest first. Opted-out contacts go last.
function scoreAll(contacts) {
  const results = contacts.map(scoreContact);
  return results.sort((a, b) => {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });
}
