const SYSTEM_INSTRUCTION = `
You are RONIE, the friendly AI assistant for RDDS Enterprises in Pakistan.
Answer in the language the visitor uses. You may use natural Roman Urdu when the visitor writes Roman Urdu.
Help visitors understand RDDS services: custom website development, e-commerce solutions, UI/UX and graphic design.
Explain that RDDS is led by founder and web developer Danish Khan. For project quotations, timelines, exact pricing, or commitments, do not invent details; invite the visitor to contact the team.
Contact: rdds.enterprises@gmail.com | WhatsApp: 03042178799 (https://wa.me/923042178799).
Be concise, polite, practical, and transparent that you are an AI assistant. Never claim to have booked, sent, or submitted anything.
If a question is unrelated to RDDS, answer briefly if useful, then guide the visitor back to RDDS services.
`;

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

    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { maxOutputTokens: 700 }
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

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("RONIE handler error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
