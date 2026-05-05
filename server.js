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

/* 🔐 OpenAI güvenli init */
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* 🚀 AI IDEA ENDPOINT */
app.post("/api/generate-idea", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({
        idea: "Lütfen bir fikir yaz.",
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
            content:
              "Sen bir SaaS fikir üreticisisin. Girişimci odaklı, kısa ve net fikirler üret.",
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
      idea: `🔥 Mock fikir: "${prompt}" için abonelik tabanlı AI platform yapılabilir.`,
      mode: "mock",
    });
  } catch (err) {
    console.error(err);

    return res.json({
      idea: "Sistem şu an yoğun, tekrar dene.",
      mode: "error_fallback",
    });
  }
});

app.listen(PORT, () => {
  console.log("AI SaaS running on", PORT);
});