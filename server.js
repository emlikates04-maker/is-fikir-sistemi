import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================= QUESTIONS ENGINE (AI YOK) =================
const QUESTIONS = [
  "Günde kaç saat bu işe ayırabilirsin?",
  "Kod biliyor musun yoksa no-code mu?",
  "Amacın hızlı para mı yoksa uzun vadeli mi?",
  "Hangi alan ilgini çekiyor? (AI, finance, e-commerce, content)",
  "Daha önce bir proje yaptın mı?"
];

// ================= FINAL PROMPT =================
const FINAL_PROMPT = `
You are a SaaS Idea Generator.

Generate ONE high-quality SaaS idea.

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

Be extremely concise.
No fluff.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.json({ reply: "Invalid request" });
    }

    const userMessages = messages.filter(m => m.role === "user");
    const step = userMessages.length;

    // ================= PHASE 1: WE CONTROL QUESTIONS =================
    if (step < 5) {
      return res.json({
        reply: QUESTIONS[step] || "Seni en çok ne motive ediyor?"
      });
    }

    // ================= PHASE 2: AI ONLY FINAL OUTPUT =================
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: mockFinal() });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: FINAL_PROMPT },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "AI error"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

// ================= MOCK FINAL =================
function mockFinal() {
  return `
=== SAAS IDEA ===
AI micro SaaS generator

=== WHY THIS WORKS ===
High demand low competition

=== TARGET USER ===
Beginner entrepreneurs

=== MONETIZATION ===
Subscription $9-$29

=== MVP PLAN ===
Step 1: Landing page
Step 2: AI engine
Step 3: Dashboard

=== FIRST ACTION ===
Get first 10 users
`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));