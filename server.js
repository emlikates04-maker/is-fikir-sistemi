import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const QUESTIONS = [
  "Günde kaç saat bu işe ayırabilirsin?",
  "Kod biliyor musun yoksa no-code mu?",
  "Amacın para mı yoksa uzun vadeli iş mi?",
  "Hangi alan ilgini çekiyor?",
  "Daha önce bir proje yaptın mı?"
];

function getStep(messages) {
  return messages.filter(m => m.role === "user").length;
}

app.post("/api/chat", async (req, res) => {
  try {
    console.log("REQ RECEIVED"); // DEBUG

    const { messages } = req.body;

    if (!messages) {
      return res.json({ reply: "No messages received" });
    }

    const step = getStep(messages);

    // ================= INTERVIEW MODE =================
    if (step < 5) {
      return res.json({
        reply: QUESTIONS[step] || "Seni en çok ne motive ediyor?"
      });
    }

    // ================= FINAL MODE =================
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "API KEY MISSING" });
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
          {
            role: "system",
            content: "Generate ONE SaaS idea in structured format."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data)); // DEBUG

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI response empty";

    return res.json({ reply });

  } catch (err) {
    console.error("FATAL ERROR:", err);
    res.json({ reply: "Server crashed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});