import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===== SYSTEM PROMPT =====
const SYSTEM_PROMPT = `
You are a SaaS Discovery AI.

GOAL:
Turn users into SaaS ideas.

FLOW:
- First 1-5 messages → ask ONE sharp question
- Collect:
  - skills
  - goals
  - time
  - experience
  - interests

- After 5+ user messages → OUTPUT FINAL SAAS IDEA:

FORMAT:

=== SAAS IDEA ===
=== WHY THIS WORKS ===
=== TARGET USER ===
=== MONETIZATION ===
=== MVP PLAN ===
Step 1:
Step 2:
Step 3:
=== FIRST ACTION ===

RULES:
- No long paragraphs
- No fluff
- Be startup founder mindset
`;

// ===== CHAT ENDPOINT =====
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.json({ reply: "Invalid request" });
    }

    const userMessages = messages.filter(m => m.role === "user");
    const shouldFinalize = userMessages.length >= 5;

    // ===== NO API KEY → SAFE FALLBACK =====
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: shouldFinalize
          ? generateFinalMock()
          : getQuestion(userMessages.length)
      });
    }

    // ===== OPENAI REQUEST =====
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.json({ reply: "AI error, retry." });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error, try again." });
  }
});

// ===== SMART QUESTION FLOW (NO API KEY MODE) =====
function getQuestion(step) {
  const questions = [
    "Günde kaç saat çalışabilirsin?",
    "Kod biliyor musun yoksa no-code mu?",
    "Hedefin para mı yoksa uzun vadeli proje mi?",
    "Hangi alan ilgini çekiyor? (AI, finance, e-commerce, content)",
    "Daha önce proje yaptın mı?"
  ];

  return questions[step] || "Beni en çok ne motive ediyor?";
}

// ===== FINAL MOCK OUTPUT =====
function generateFinalMock() {
  return `
=== SAAS IDEA ===
AI destekli freelance iş bulma platformu

=== WHY THIS WORKS ===
Yeni başlayanlar için yüksek talep

=== TARGET USER ===
Online para kazanmak isteyen bireyler

=== MONETIZATION ===
Aylık abonelik $9-$29

=== MVP PLAN ===
Step 1: Landing page
Step 2: AI eşleştirme sistemi
Step 3: Dashboard

=== FIRST ACTION ===
İlk 10 kullanıcıyı bul
`;
}

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});