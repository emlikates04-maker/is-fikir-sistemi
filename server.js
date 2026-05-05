import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static("public"));

// OpenAI SAFE INIT
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// API ROUTE
app.post("/api/generate-idea", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt boş olamaz" });
    }

    // 🔥 REAL AI MODE
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sen bir SaaS fikir üreticisisin. Kısa, net ve girişim odaklı fikirler üret.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return res.json({
        idea: completion.choices[0].message.content,
        mode: "ai",
      });
    }

    // 🧠 FALLBACK MODE (AI YOKSA)
    return res.json({
      idea: `🔥 Mock SaaS Fikri: "${prompt}" için abonelik tabanlı AI destekli platform oluşturulabilir.`,
      mode: "mock",
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      idea: "Sistem şu an yoğun. Lütfen tekrar dene.",
      mode: "error_fallback",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});