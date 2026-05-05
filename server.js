import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* 🧠 SESSION MEMORY (MVP) */
const sessions = {};

/* 🚀 AI INTERVIEW */
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    sessions[sessionId].push({ role: "user", content: message });

    if (!openai) {
      return res.json({
        reply: "AI yok, mock mode",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Sen bir SaaS fikir discovery AI'sın.

Görevin:
- Kullanıcıdan bilgi toplamak
- HER cevaptan sonra 1 DERİNLEŞTİRİCİ SORU SORMAK
- Amaç: kullanıcıyı tanıyıp en iyi SaaS fikrini çıkarmak

Kurallar:
- Asla direkt final fikir verme (ilk aşamalarda)
- Sürekli soru sor
- Kısa yaz
- Tek soru sor
`,
        },
        ...sessions[sessionId],
      ],
    });

    const aiMessage = response.choices[0].message.content;

    sessions[sessionId].push({
      role: "assistant",
      content: aiMessage,
    });

    res.json({
      reply: aiMessage,
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Hata oluştu" });
  }
});

app.listen(3000);
console.log("API KEY VAR MI:", !!process.env.OPENAI_API_KEY);