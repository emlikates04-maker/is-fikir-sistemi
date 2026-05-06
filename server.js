import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================= AI SYSTEM PROMPT =================
const SYSTEM_PROMPT = `
You are an elite SaaS Idea Discovery AI.

MISSION:
You interview users like a startup founder.

CORE RULE:

🔵 PHASE 1 (Discovery):
If user messages < 5:
- Ask ONLY ONE question per message
- Never give ideas yet
- Focus on:
  skills
  time availability
  interests
  income goal
  experience

🔵 PHASE 2 (Generation):
If user messages >= 5:
Generate SaaS idea ONLY in this format:

=== SAAS IDEA ===
=== WHY THIS WORKS ===
=== TARGET USER ===
=== MONETIZATION ===
=== MVP PLAN ===
Step 1:
Step 2:
Step 3:
=== FIRST ACTION ===

STYLE RULES:
- Be extremely concise
- No fluff
- Think like YC founder
`;

// ================= CHAT ENDPOINT =================
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.json({ reply: "Invalid request format." });
    }

    const userMessages = messages.filter(m => m.role === "user");
    const shouldFinalize = userMessages.length >= 5;

    // ================= FALLBACK MODE =================
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: shouldFinalize
          ? mockFinal()
          : mockQuestion(userMessages.length)
      });
    }

    // ================= OPENAI CALL =================
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

    if (!data.choices?.[0]) {
      return res.json({ reply: "AI response error." });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error occurred." });
  }
});

// ================= MOCK FLOW =================
function mockQuestion(step) {
  const questions = [
    "Günde kaç saat bu işe ayırabilirsin?",
    "Kod biliyor musun yoksa no-code mu?",
    "Hedefin para mı yoksa uzun vadeli iş mi?",
    "Hangi alana yakınsın? (AI, finance, e-commerce, content)",
    "Daha önce bir proje yaptın mı?"
  ];

  return questions[step] || "En güçlü motivasyonun ne?";
}

function mockFinal() {
  return `
=== SAAS IDEA ===
AI destekli freelance iş eşleştirme platformu

=== WHY THIS WORKS ===
Yeni başlayanlar için büyük pazar

=== TARGET USER ===
Online para kazanmak isteyen bireyler

=== MONETIZATION ===
Aylık abonelik ($9-$29)

=== MVP PLAN ===
Step 1: Landing page
Step 2: AI matching system
Step 3: Dashboard

=== FIRST ACTION ===
İlk 10 kullanıcıyı bul ve test et
`;
}

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});