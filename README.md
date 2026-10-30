# Seller Signal

A one-page concept demo of a transparent seller score for real estate agents. It ranks an agent's **own** CRM contacts by how timely a conversation about selling might be, explains every score in one neutral sentence, and drafts a friendly first message for the top 5.

All names and data are fictional. This is an unofficial concept demo, not an Indigo Stride product.

## What it does

- Scores 25 fake CRM contacts from 0 to 100 using simple point rules anyone can read.
- Shows a one-sentence neutral reason for each score, built from the same rules (no raw notes or data).
- Excludes opted-out contacts from scoring and outreach, and marks them clearly.
- Tags warm contacts that have gone untouched for 12+ months as possible **Shark Tank** hand-offs.
- Drafts short outreach messages for the top 5 using Gemini, through a serverless function. If there's no API key, or the AI call fails, it falls back to a template message, so the demo never breaks.

## How scoring works

Each contact starts at 0. Points are added for each rule that applies, and the total is kept between 0 and 100.

| Rule | Points |
|---|---|
| Owned the home 7+ years | +25 |
| Estimated equity gain of 40% or more | +20 |
| Asked about home prices (last 90 days) | +30 |
| Opened a market report (last 90 days) | +15 |
| Contacted within the last 6 months | +10 |
| No contact in 12+ months | -10 |

**Shark Tank candidate:** score of 50+ and no contact in 12+ months.

All rules live in one place: `SCORING_RULES` at the top of `scoring.js`. Change a number there and the scores, reasons and "How scoring works" section on the page all update.

### Excluded for Fair Housing reasons

Life-event signals (divorce, marriage, new baby, death in the family, aging parents) can line up with protected classes, so they are never used as inputs. Neither are age, race, colour, religion, sex, national origin, familial status, disability, neighbourhood demographics, health information or free-text agent notes. The demo data doesn't contain these fields at all.

## Files

| File | Job |
|---|---|
| `index.html` | Page structure |
| `style.css` | Look and feel (brand colours at the top) |
| `data.js` | The 25 fake contacts |
| `scoring.js` | Scoring rules, score, reason, Shark Tank tag |
| `app.js` | Builds the tables and handles the outreach button |
| `api/outreach.js` | Vercel serverless function that calls Gemini, with template fallback |

## How to run it

**Quick look (no AI):** open `index.html` in a browser. Scoring works fully. The outreach button uses the template, because there's no server.

**On Vercel (with AI):**
1. Push this folder to a GitHub repo.
2. In Vercel, choose **Add New > Project** and import the repo. No build settings are needed.
3. In **Settings > Environment Variables**, add `GEMINI_API_KEY` (from Google AI Studio). Optionally add `GEMINI_MODEL` to use a different Gemini model.
4. Redeploy. The outreach button now returns AI drafts, labelled "AI draft."

**Locally with the function:** install the Vercel CLI (`npm i -g vercel`), then run `vercel dev` in this folder.

## Privacy by design

- Only the agent's own contacts are scored. No purchased or scraped lists.
- Agents see a score and a neutral reason, never raw sensitive notes.
- Opted-out contacts are never scored, and never sent to the AI.
- The AI receives only a first name and the neutral reason. No equity figures or other data.
- The API key stays on the server in an environment variable.

**Demo limitation:** the fake data is loaded in the browser. In production, data and scoring would stay on the server, behind login, with each agent only seeing their own contacts.

## Next steps

1. **CRM integration:** pull contacts from the agent's existing CRM through its API, and run scoring on the server on a schedule.
2. **Emma add-on:** surface the top contacts and drafted messages inside Emma as a per-seat add-on, with the agent approving every message before it's sent.
3. **Shark Tank hand-off:** after agent and brokerage consent, offer warm contacts that have gone stale to the Shark Tank pool, with the rules for this agreed in advance.
4. **Opt-out and deletion:** honour opt-outs everywhere and support full deletion requests, in line with US state privacy laws (e.g. Tennessee).
5. **Legal review of inputs:** have a Fair Housing and privacy lawyer review every scoring input and the outreach wording before launch.
6. **Measure and tune:** track which scored contacts actually became listings, and adjust the point values with real data rather than guesses.
