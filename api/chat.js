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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "RONIE AI setup pending. Please contact RDDS on WhatsApp: 03042178799." });
  }

  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const contents = incoming
      .filter(item => ["user", "model"].includes(item?.role) && Array.isArray(item?.parts))
      .slice(-12)
      .map(item => ({
        role: item.role,
        parts: item.parts
          .filter(part => typeof part?.text === "string")
          .slice(0, 1)
          .map(part => ({ text: part.text.slice(0, 3000) }))
      }))
      .filter(item => item.parts.length);

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "Please enter a message first." });
    }

    const latestMessage = contents[contents.length - 1].parts[0].text;
    const agent = chooseAgent(latestMessage);
    const systemInstruction = BASE_INSTRUCTION + "\\n\\n" + AGENT_INSTRUCTIONS[agent];

    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { maxOutputTokens: 850, temperature: 0.65 }
        })
      }
    );

    const result = await upstream.json();
    if (!upstream.ok) {
      const providerMessage = String(result?.error?.message || "Unknown Gemini API error").slice(0, 240);
      console.error("Gemini API error:", upstream.status, providerMessage);
      return res.status(502).json({
        error: `Gemini API error (HTTP ${upstream.status}): ${providerMessage}`
      });
    }

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "RONIE could not generate a reply. Please try again." });
    }

    return res.status(200).json({ reply, agent });
  } catch (error) {
    console.error("RONIE handler error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
