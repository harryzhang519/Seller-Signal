// =====================================================================
// SERVERLESS FUNCTION: /api/outreach
// ---------------------------------------------------------------------
// Runs on Vercel's servers, not in the browser, so the API key stays secret.
//
// Receives:  { contacts: [ { id, firstName, reason }, ... ] }   (max 5)
// Returns:   { messages: [ { id, message, source: "ai" | "template" }, ... ] }
//
// If GEMINI_API_KEY isn't set, or Gemini fails for any contact, that
// contact gets a template message instead. This function never errors out
// because of the AI.
//
// Environment variables (set in Vercel > Project > Settings):
//   GEMINI_API_KEY  - your key from Google AI Studio (required for AI drafts)
//   GEMINI_MODEL    - optional, defaults to the model below
// =====================================================================

// A fast "lite" model: short messages don't need a heavy model, and the
// bigger "thinking" models can take 30+ seconds to reply.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_CONTACTS = 5; // cost guard: never draft more than 5 per request

// Keep in sync with templateMessage() in app.js.
function templateMessage(name) {
  return "Hi " + name + ", I've been keeping an eye on the local market and thought you might like " +
    "a quick, no-pressure update on what homes near you are selling for. Happy to send it over whenever suits you.";
}

function buildPrompt(firstName, reason) {
  return [
    "Write a short, friendly first message from a real estate agent to a past contact named " + firstName + ".",
    "Background for the agent only: " + reason,
    "Rules:",
    "- Two or three sentences, under 60 words.",
    "- Offer a no-pressure local market update. Do not pressure them to sell.",
    "- Do not mention equity, home value gains, how long they have owned the home, or any personal circumstances.",
    "- Warm and professional. No emojis, no subject line, no signature. Plain text only.",
  ].join("\n");
}

async function askGemini(apiKey, model, prompt) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    signal: AbortSignal.timeout(10000), // give up after 10 seconds
  });
  if (!response.ok) throw new Error("Gemini returned " + response.status);

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text");
  return text.trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Clean up the input: only keep what we expect, and cap the number of contacts.
  const incoming = Array.isArray(req.body?.contacts) ? req.body.contacts : [];
  const contacts = incoming.slice(0, MAX_CONTACTS).map((c) => ({
    id: String(c.id || ""),
    firstName: String(c.firstName || "there").slice(0, 40),
    reason: String(c.reason || "").slice(0, 300),
  }));

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  // Draft all messages at the same time. Each one falls back on its own.
  const messages = await Promise.all(
    contacts.map(async (c) => {
      if (!apiKey) {
        return { id: c.id, message: templateMessage(c.firstName), source: "template" };
      }
      try {
        const text = await askGemini(apiKey, model, buildPrompt(c.firstName, c.reason));
        return { id: c.id, message: text, source: "ai" };
      } catch (error) {
        console.error("Gemini failed for " + c.id + ": " + error.message); // visible in Vercel logs
        return { id: c.id, message: templateMessage(c.firstName), source: "template" };
      }
    })
  );

  res.status(200).json({ messages });
};
