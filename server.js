require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(express.static(path.join(__dirname, "public")));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const SYSTEM_PROMPT = `
You are an AI SaaS discovery assistant.

Your goal:
- Analyze the user deeply
- Ask ONE question at a time
- Never instantly give startup ideas
- Sound natural like ChatGPT
- Short answers
- No generic motivation
- Discover:
  - skills
  - interests
  - problems
  - time availability
  - income goals
  - technical level

Conversation strategy:
- First 8+ messages are discovery mode
- Ask follow-up questions
- Understand user's psychology and behavior
- Avoid long paragraphs

Only after enough information generate:

=== SAAS IDEA ===
=== WHY IT FITS USER ===
=== TARGET USERS ===
=== MONETIZATION ===
=== MVP PLAN ===
=== TECH STACK ===
=== FIRST ACTION ===
`;

function fallbackAI(message, history = []) {
  const totalMessages = history.length;

  if (totalMessages < 2) {
    return "En çok vakit geçirdiğin alan ne? Teknoloji, içerik, finans, oyun, otomasyon vs?";
  }

  if (totalMessages < 4) {
    return "Şu an internetten para kazanmayı denesen en rahat hangi skillini kullanırsın?";
  }

  if (totalMessages < 6) {
    return "Günde gerçekçi şekilde kaç saat ayırabilirsin?";
  }

  if (totalMessages < 8) {
    return "İnsanların yaşadığı hangi problem sana sürekli gözüne çarpıyor?";
  }

  return `
=== SAAS IDEA ===
AI niche problem finder

=== WHY IT FITS USER ===
You like analyzing trends and online opportunities.

=== TARGET USERS ===
Beginner founders

=== MONETIZATION ===
Monthly subscription

=== MVP PLAN ===
- Landing page
- AI chat
- Problem database

=== TECH STACK ===
Node.js + OpenAI + Render

=== FIRST ACTION ===
Build simple chat MVP
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message missing",
      });
    }

    if (!client) {
      return res.json({
        reply: fallbackAI(message, history),
      });
    }

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...(history || []),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
      max_tokens: 300,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Biraz daha detay anlatır mısın?";

    res.json({
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Şu an kısa bir bağlantı problemi oldu. Devam et tekrar.",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});