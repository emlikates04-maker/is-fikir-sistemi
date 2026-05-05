import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static("public"));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* 🧠 AI IDEA GENERATION */
app.post("/api/generate-idea", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({
        idea: "Lütfen bir konu gir.",
        mode: "error",
      });
    }

    /* 🤖 REAL AI */
    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Sen bir YC seviyesinde SaaS fikir üreticisisin.

Kurallar:
- Çok kısa ve net yaz
- Gereksiz açıklama yapma
- Direkt iş fikri ver
- Monetization önerisi ekle
`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return res.json({
        idea: response.choices[0].message.content,
        mode: "ai",
      });
    }

    /* 🧠 FALLBACK (AI YOKSA) */
    return res.json({
      idea: `Bu fikir için SaaS oluşturulabilir: ${prompt} tabanlı AI platform.`,
      mode: "mock",
    });
  } catch (err) {
    console.error(err);

    return res.json({
      idea: "Sistem yoğun, tekrar dene.",
      mode: "error_fallback",
    });
  }
});

app.listen(PORT, () => {
  console.log("AI SaaS running on", PORT);
});