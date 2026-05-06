import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/**
 * CHAT STATE RULE:
 * we control flow ONLY by counting user messages
 */

function getSystemPrompt(step) {
  if (step < 5) {
    return `
You are a SaaS Idea Interview AI.

GOAL:
Ask ONLY ONE question per message.

DO NOT give ideas.

FOCUS:
- skills
- time availability
- interests
- money goal
- experience level

Be short. One question only.
`;
  }

  return `
You are a SaaS Idea Generator AI.

Now you have enough information.

Generate a SaaS idea ONLY in this format:

=== SAAS IDEA ===
=== WHY THIS WORKS ===
=== TARGET USER ===
=== MONETIZATION ===
=== MVP PLAN ===
Step 1:
Step 2:
Step 3:
=== FIRST ACTION ===

Rules:
- no questions anymore
- no fluff
- be sharp
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.json({ reply: "Invalid request" });
    }

    const userMessages = messages.filter(m => m.role === "user");
    const step = userMessages.length;

    // ===== FALLBACK MODE =====
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: step < 5
          ? fallbackQuestions(step)
          : fallbackFinal()
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
          { role: "system", content: getSystemPrompt(step) },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices?.[0]) {
      return res.json({ reply: "AI error" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error" });
  }
});

/**
 * FALLBACK QUESTIONS
 */
function fallbackQuestions(step) {
  const q = [
    "Günde kaç saat bu işe ayırabilirsin?",
    "Kod biliyor musun yoksa no-code mu?",
    "Hedefin para mı yoksa uzun vadeli iş mi?",
    "Hangi alan ilgini çekiyor?",
    "Daha önce proje yaptın mı?"
  ];
  return q[step] || "Seni en çok ne motive ediyor?";
}

/**
 * FALLBACK FINAL
 */
function fallbackFinal() {
  return `
=== SAAS IDEA ===
AI destekli mikro SaaS platformu

=== WHY THIS WORKS ===
Düşük maliyet + yüksek talep

=== TARGET USER ===
Yeni başlayan girişimciler

=== MONETIZATION ===
Aylık abonelik

=== MVP PLAN ===
Step 1: Landing page
Step 2: AI engine
Step 3: Dashboard

=== FIRST ACTION ===
İlk 10 kullanıcıyı bul
`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});