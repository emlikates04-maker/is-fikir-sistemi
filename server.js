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
let client = null;

try {
  if (process.env.OPENAI_API_KEY) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (e) {
  console.log("OpenAI init failed, fallback mode");
}

const SYSTEM_PROMPT = `
You are SaaS discovery AI.

Rules:
- Ask ONE question only
- Never give final idea early
- Be short
- Think like startup founder
`;

function fallback(history = []) {
  const len = history.length;

  if (len < 2) return "Hangi alanda daha çok vakit geçiriyorsun?";
  if (len < 4) return "Bu alanda bir problem yaşadın mı?";
  if (len < 6) return "Günde kaç saat çalışabilirsin?";
  if (len < 8) return "Para kazanma hedefin nedir?";

  return `
=== SAAS IDEA ===
AI Micro SaaS Tool

=== WHY IT FITS USER ===
Based on your interests and time capacity

=== TARGET USERS ===
Indie builders

=== MONETIZATION ===
Subscription

=== MVP PLAN ===
Simple AI chat + tracking

=== TECH STACK ===
Node.js + OpenAI + Render

=== FIRST ACTION ===
Build landing page
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.json({ reply: "Mesaj boş" });
    }

    // SAFE MODE
    if (!client) {
      return res.json({
        reply: fallback(history),
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
      max_tokens: 300,
    });

    res.json({
      reply: completion.choices?.[0]?.message?.content || "Tekrar dener misin?",
    });

  } catch (err) {
    console.log("ERROR:", err);

    res.status(200).json({
      reply: "Sistem şu an fallback modda çalışıyor.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});