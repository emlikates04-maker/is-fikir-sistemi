require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai").default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// SAFE INIT
let ai = null;

if (process.env.OPENAI_API_KEY) {
  ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are a SaaS discovery AI.

RULES:
- Ask ONE question only
- Never give final SaaS idea early
- Be short
- Think like startup founder
- Extract:
  skills, time, goals, problems, interests
`;

function fallback(history = []) {
  const n = history.length;

  if (n < 2) return "Hangi alan ilgini çekiyor? (AI, para kazanma, yazılım, içerik?)";
  if (n < 4) return "Bu alanda bir problem yaşadın mı?";
  if (n < 6) return "Günde kaç saat ayırabilirsin?";
  if (n < 8) return "Hedefin aylık ne kadar kazanmak?";

  return `
=== SAAS IDEA ===
AI Micro SaaS Tool for niche automation

=== WHY IT FITS USER ===
Based on your interests and time capacity

=== TARGET USERS ===
Indie founders

=== MONETIZATION ===
Subscription ($10-$30/month)

=== MVP PLAN ===
- Simple chat UI
- AI prompt engine
- User tracking

=== TECH STACK ===
Node.js + Express + OpenAI + Render

=== FIRST ACTION ===
Build landing page + simple chat
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.json({ reply: "Mesaj boş olamaz" });
    }

    // NO API KEY SAFE MODE
    if (!ai) {
      return res.json({
        reply: fallback(history),
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ];

    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
      max_tokens: 300,
    });

    res.json({
      reply:
        response.choices?.[0]?.message?.content ||
        "Bir şey daha sorabilir misin?",
    });

  } catch (err) {
    console.log("ERROR:", err);

    res.json({
      reply: "Sistem fallback modda çalışıyor, devam et.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});