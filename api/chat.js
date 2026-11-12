const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

const BASE_INSTRUCTION = `
You are RONIE, the intelligent digital assistant for RDDS Enterprises in Pakistan.
You are an AI assistant, not a human. Speak naturally in the visitor's language; use fluent Roman Urdu when they write Roman Urdu.
RDDS services: custom website development (business websites and web apps), e-commerce solutions (online stores and integrations), and UI/UX plus graphic design.
RDDS is led by founder and web developer Danish Khan.
Contact: rdds.enterprises@gmail.com | WhatsApp: 03042178799 (https://wa.me/923042178799).
Never invent prices, discounts, delivery dates, technical guarantees, client results, or project commitments. For exact quotations and timelines, explain that the team must review the requirements.
Ask only one useful follow-up question at a time. Understand the visitor's goal before recommending a service. Keep answers helpful, specific, and concise.
Do not request passwords, payment-card details, OTPs, or other sensitive information. Ask permission before requesting contact details. This chat does not submit or store enquiries; direct visitors to the contact form or WhatsApp when they want a human follow-up.
Never claim to have booked, sent, saved, or submitted anything.
If a question is unrelated to RDDS, answer briefly if useful and gently bring the conversation back to the visitor's digital/business needs.
`;

const AGENT_INSTRUCTIONS = {
  sales: `
SPECIALIST MODE: SALES CONSULTANT.
Help the visitor understand which RDDS service may fit their business. Discover their business type, desired outcome, and whether they need a website, online store, or design. Explain benefits without pressure. Do not quote unverified prices. Ask one question at a time and invite them to request a consultation when appropriate.
`,
  project: `
SPECIALIST MODE: PROJECT CONSULTANT.
Act as a practical discovery consultant. Clarify the project goal, target audience, required features, reference examples, and preferred launch window only as relevant. Do not overwhelm the visitor with a questionnaire: ask the single most useful next question. Summarize the requirements once enough information is available and explain that RDDS must review them before confirming price or timeline.
`,
  support: `
SPECIALIST MODE: CLIENT SUPPORT.
Help with existing RDDS website, service, or project questions. Diagnose carefully by asking for the exact issue and relevant non-sensitive details. Never ask for passwords, OTPs, API keys, or payment details. Do not claim to access customer accounts or internal project systems. For account-specific or urgent human help, share RDDS WhatsApp and email.
`,
  general: `
SPECIALIST MODE: GENERAL RDDS ASSISTANT.
Answer questions about RDDS, its services, process, and how to get started. Be welcoming and useful; guide the visitor toward a clear next step without sounding like a scripted FAQ bot.
`
};

function chooseAgent(message) {
  const text = String(message || "").toLowerCase();
  if (/\b(bug|error|issue|problem|not working|website down|support|complaint|repair|fix|login|update my order|project status)\b/.test(text) ||
      /(masla|maslay|kaam nahi|error|issue|support|complaint|theek nahi|problem|login|status)/.test(text)) return "support";
  if (/\b(build|develop|create|make|need|want|require|project|website|store|ecommerce|e-commerce|app|redesign|features|quotation|quote|estimate)\b/.test(text) ||
      /(banwana|banani|banwana hai|website chahiye|store chahiye|project|features|design karwana|kitna kharcha|price|cost|budget)/.test(text)) return "project";
  if (/\b(price|pricing|cost|business|grow|sell|sales|customer|marketing|service|services|package|hire|contact|buy)\b/.test(text) ||
      /(business|karobar|sales|customers|service|services|rate|qeemat|rabta|kaam karwana)/.test(text)) return "sales";
  return "general";
}

function cleanText(value, maxLength = 4000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "RONIE AI setup pending. RDDS admin: add OPENAI_API_KEY to Vercel Environment Variables and redeploy."
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === "string") {
      try { body = JSON.parse(body); }
      catch { return res.status(400).json({ error: "Invalid JSON request body." }); }
    }

    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages = incoming
      .filter(item => ["user", "model", "assistant"].includes(item?.role) && Array.isArray(item?.parts))
      .slice(-12)
      .map(item => ({
        role: item.role === "user" ? "user" : "assistant",
        text: cleanText(item.parts.find(part => typeof part?.text === "string")?.text)
      }))
      .filter(item => item.text);

    while (messages[0]?.role === "assistant") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return res.status(400).json({ error: "Please enter a message first." });
    }

    const agent = chooseAgent(messages[messages.length - 1].text);
    const instructions = BASE_INSTRUCTION + "\n\n" + AGENT_INSTRUCTIONS[agent];
    const input = messages.map(item => ({
      role: item.role,
      content: [{ type: "input_text", text: item.text }]
    }));

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input,
        max_output_tokens: 850,
      }),
      signal: AbortSignal.timeout(30000)
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = payload?.error?.message || `OpenAI request failed with status ${upstream.status}.`;
      console.error("RDDS RONIE OpenAI error:", upstream.status, message);
      return res.status(upstream.status).json({ error: message });
    }

    const reply = payload.output_text || (payload.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text" && part.text)
      .map(part => part.text)
      .join("\n")
      .trim();

    if (!reply) return res.status(502).json({ error: "RONIE could not generate a reply. Please try again." });
    return res.status(200).json({ reply, agent, model: MODEL });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    console.error("RDDS RONIE handler error:", error);
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? "RONIE took too long to respond. Please try again." : "Could not connect to OpenAI. Please try again."
    });
  }
}
