// =====================================================================
// FAKE CRM CONTACTS (demo only)
// ---------------------------------------------------------------------
// Every name here is made up. In a real product these rows would come
// from the agent's OWN CRM, never from purchased or scraped lists.
//
// Fields:
//   id                 - unique ID for the contact
//   name               - display name (fake)
//   yearsOwned         - how long they have owned their home
//   equityGainPct      - estimated % increase in home value since purchase
//   monthsSinceContact - months since the agent last spoke with them
//   engagement         - things they did in the LAST 90 DAYS:
//                          "asked_about_prices"   (asked what homes sell for)
//                          "opened_market_report" (opened the agent's report email)
//   optedOut           - true = they asked not to be contacted or scored
//
// On purpose, there are NO fields for life events, notes, age, family,
// or anything else that could line up with a protected class under
// Fair Housing rules. Data we never collect can't be misused.
// =====================================================================

const CONTACTS = [
  { id: "C01", name: "Patty Placeholder",  yearsOwned: 9,  equityGainPct: 52, monthsSinceContact: 2,  engagement: ["asked_about_prices", "opened_market_report"], optedOut: false },
  { id: "C02", name: "Sam Sample",         yearsOwned: 11, equityGainPct: 61, monthsSinceContact: 4,  engagement: ["asked_about_prices"],                         optedOut: false },
  { id: "C03", name: "Danny Demo",         yearsOwned: 8,  equityGainPct: 45, monthsSinceContact: 14, engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C04", name: "Fiona Fakename",     yearsOwned: 3,  equityGainPct: 12, monthsSinceContact: 1,  engagement: ["asked_about_prices"],                         optedOut: false },
  { id: "C05", name: "Molly Mockup",       yearsOwned: 7,  equityGainPct: 38, monthsSinceContact: 5,  engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C06", name: "Terry Testcase",     yearsOwned: 15, equityGainPct: 70, monthsSinceContact: 20, engagement: [],                                             optedOut: false },
  { id: "C07", name: "Nora Nobody",        yearsOwned: 2,  equityGainPct: 5,  monthsSinceContact: 8,  engagement: [],                                             optedOut: false },
  { id: "C08", name: "Ollie Optout",       yearsOwned: 12, equityGainPct: 65, monthsSinceContact: 3,  engagement: ["asked_about_prices"],                         optedOut: true  },
  { id: "C09", name: "Randy Random",       yearsOwned: 6,  equityGainPct: 41, monthsSinceContact: 3,  engagement: ["asked_about_prices", "opened_market_report"], optedOut: false },
  { id: "C10", name: "Betty Beta",         yearsOwned: 10, equityGainPct: 48, monthsSinceContact: 16, engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C11", name: "Gary Generic",       yearsOwned: 4,  equityGainPct: 22, monthsSinceContact: 9,  engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C12", name: "Holly Hypothetical", yearsOwned: 9,  equityGainPct: 33, monthsSinceContact: 2,  engagement: ["asked_about_prices"],                         optedOut: false },
  { id: "C13", name: "Ivan Imaginary",     yearsOwned: 1,  equityGainPct: 3,  monthsSinceContact: 0,  engagement: [],                                             optedOut: false },
  { id: "C14", name: "Penny Pretend",      yearsOwned: 13, equityGainPct: 58, monthsSinceContact: 1,  engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C15", name: "Lenny Lorem",        yearsOwned: 5,  equityGainPct: 28, monthsSinceContact: 13, engagement: [],                                             optedOut: false },
  { id: "C16", name: "Ida Ipsum",          yearsOwned: 8,  equityGainPct: 44, monthsSinceContact: 7,  engagement: [],                                             optedOut: false },
  { id: "C17", name: "Owen Outlist",       yearsOwned: 9,  equityGainPct: 50, monthsSinceContact: 6,  engagement: [],                                             optedOut: true  },
  { id: "C18", name: "Xavier Example",     yearsOwned: 7,  equityGainPct: 39, monthsSinceContact: 3,  engagement: ["asked_about_prices", "opened_market_report"], optedOut: false },
  { id: "C19", name: "Yara Unreal",        yearsOwned: 3,  equityGainPct: 18, monthsSinceContact: 2,  engagement: ["opened_market_report"],                       optedOut: false },
  { id: "C20", name: "Zed Zero",           yearsOwned: 20, equityGainPct: 80, monthsSinceContact: 26, engagement: [],                                             optedOut: false },
  { id: "C21", name: "Wendy Widget",       yearsOwned: 6,  equityGainPct: 35, monthsSinceContact: 10, engagement: ["asked_about_prices"],                         optedOut: false },
  { id: "C22", name: "Victor Virtual",     yearsOwned: 11, equityGainPct: 47, monthsSinceContact: 12, engagement: ["asked_about_prices"],                         optedOut: false },
  { id: "C23", name: "Uma Untested",       yearsOwned: 2,  equityGainPct: 9,  monthsSinceContact: 4,  engagement: ["asked_about_prices", "opened_market_report"], optedOut: false },
  { id: "C24", name: "Carl Counterfeit",   yearsOwned: 8,  equityGainPct: 29, monthsSinceContact: 11, engagement: [],                                             optedOut: false },
  { id: "C25", name: "Pat Pseudonym",      yearsOwned: 4,  equityGainPct: 20, monthsSinceContact: 1,  engagement: ["opened_market_report"],                       optedOut: true  },
];
