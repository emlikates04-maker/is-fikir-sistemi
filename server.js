require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const OpenAI = require("openai").default; // 🔥 KRİTİK FIX

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OPENAI SAFE INIT
let client = null;

if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `
You are an AI SaaS discovery assistant.

Rules:
- Ask ONE question at a time
- Do NOT give final SaaS idea early
- Analyze user deeply
- Be short and direct
- Think like startup founder
`;

function fallbackAI(history = []) {
  const len = history.length;

  if (len < 2) return "Ne yaparak para kazanmayı düşünüyorsun?";
  if (len < 4) return "Teknik seviyen nedir? (0-10)";
  if (len < 6) return "Günde kaç saat ayırabilirsin?";
  if (len < 8) return "Hangi problem seni sinirlendiriyor?";

  return `
=== SAAS IDEA ===
Micro AI automation tool

=== WHY IT FITS USER ===
You like problem solving

=== TARGET USERS ===
Solo founders

=== MONETIZATION ===
Subscription

=== MVP PLAN ===
Simple AI chat + form

=== TECH STACK ===
Node.js + OpenAI + Render

=== FIRST ACTION ===
Build MVP in 1 day
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.json({ reply: "Mesaj boş olamaz" });
    }

    // 🔥 NO API KEY = SAFE MODE
    if (!client) {
      return res.json({
        reply: fallbackAI(history),
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
      reply:
        completion.choices?.[0]?.message?.content ||
        "Bir şeyler sorabilir misin?",
    });
  } catch (err) {
    console.error("API ERROR:", err);

    res.status(500).json({
      reply: "Server error oldu ama sistem ayakta.",
    });
  }
});

// SPA fallback SAFE
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});