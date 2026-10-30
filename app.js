// =====================================================================
// APP: connects the data and the scoring rules to the page
// ---------------------------------------------------------------------
// 1. Score every contact (using scoring.js)
// 2. Fill in the contacts table and the "How scoring works" table
// 3. When the button is clicked, get outreach drafts for the top 5
// =====================================================================

const results = scoreAll(CONTACTS);

// Small helper: makes an HTML element with an optional class and text.
// Using textContent (not innerHTML) means text is always shown as plain
// text, so nothing from the data or the AI can inject code into the page.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function scoreClass(score) {
  if (score >= 70) return "score score-high";
  if (score >= 40) return "score score-mid";
  return "score score-low";
}

function firstName(contact) {
  return contact.name.split(" ")[0];
}

// ---------------------------------------------------------------------
// Contacts table
// ---------------------------------------------------------------------
function renderContactsTable() {
  const body = document.getElementById("contacts-body");

  results.forEach((result, index) => {
    const c = result.contact;
    const row = el("tr", result.score === null ? "opted-out" : "");

    row.appendChild(el("td", "", result.score === null ? "–" : String(index + 1)));

    const nameCell = el("td", "", c.name);
    if (result.sharkTank) nameCell.appendChild(el("span", "tag tag-shark", "Shark Tank"));
    if (result.score === null) nameCell.appendChild(el("span", "tag tag-opted", "Opted out"));
    row.appendChild(nameCell);

    const scoreCell = el("td");
    if (result.score === null) scoreCell.textContent = "–";
    else scoreCell.appendChild(el("span", scoreClass(result.score), String(result.score)));
    row.appendChild(scoreCell);

    row.appendChild(el("td", "", result.reason));
    row.appendChild(el("td", "", c.yearsOwned + " yrs"));
    row.appendChild(el("td", "", c.equityGainPct + "%"));
    row.appendChild(el("td", "", c.monthsSinceContact === 0 ? "This month" : c.monthsSinceContact + " mo ago"));

    body.appendChild(row);
  });
}

// ---------------------------------------------------------------------
// "How scoring works" table, built straight from SCORING_RULES so the
// explanation on the page always matches the real rules
// ---------------------------------------------------------------------
function renderRulesTable() {
  const body = document.getElementById("rules-body");

  SCORING_RULES.forEach((rule) => {
    const row = el("tr");
    row.appendChild(el("td", "", rule.label));
    const sign = rule.points > 0 ? "+" : "";
    row.appendChild(el("td", rule.points > 0 ? "points-plus" : "points-minus", sign + rule.points));
    body.appendChild(row);
  });
}

// ---------------------------------------------------------------------
// Outreach drafts for the top 5
// ---------------------------------------------------------------------

// Backup template used if the server can't be reached at all
// (for example, when the page is opened as a local file).
// Keep in sync with templateMessage() in api/outreach.js.
function templateMessage(name) {
  return "Hi " + name + ", I've been keeping an eye on the local market and thought you might like " +
    "a quick, no-pressure update on what homes near you are selling for. Happy to send it over whenever suits you.";
}

function renderOutreach(top5, messages) {
  const list = document.getElementById("outreach-list");
  list.innerHTML = "";

  top5.forEach((result) => {
    const match = messages.find((m) => m.id === result.contact.id);
    const card = el("div", "outreach-card");

    const heading = el("h3", "", result.contact.name);
    heading.appendChild(el("span", "source", match.source === "ai" ? "AI draft" : "Template"));
    card.appendChild(heading);
    card.appendChild(el("p", "", match.message));

    list.appendChild(card);
  });
}

async function draftOutreach() {
  const button = document.getElementById("draft-btn");
  const status = document.getElementById("draft-status");

  // Top 5 scored contacts. Opted-out contacts have no score, so they can never be here.
  const top5 = results.filter((r) => r.score !== null).slice(0, 5);

  // Only send the minimum: ID, first name, and the neutral reason. No equity or other data.
  const payload = top5.map((r) => ({ id: r.contact.id, firstName: firstName(r.contact), reason: r.reason }));

  button.disabled = true;
  status.textContent = "Drafting messages...";

  let messages;
  try {
    const response = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: payload }),
      signal: AbortSignal.timeout(20000), // give up after 20 seconds
    });
    if (!response.ok) throw new Error("Server returned " + response.status);
    messages = (await response.json()).messages;

    const aiCount = messages.filter((m) => m.source === "ai").length;
    status.textContent = aiCount === messages.length
      ? "Drafted by AI. Review before sending."
      : "AI unavailable, so template messages are shown.";
  } catch (error) {
    // Server unreachable or broken: fall back to the template so the demo never breaks.
    messages = payload.map((p) => ({ id: p.id, message: templateMessage(p.firstName), source: "template" }));
    status.textContent = "Couldn't reach the server, so template messages are shown.";
  }

  renderOutreach(top5, messages);
  button.disabled = false;
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------
renderContactsTable();
renderRulesTable();
document.getElementById("draft-btn").addEventListener("click", draftOutreach);
