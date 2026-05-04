import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 CRASH ENGELLEME
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

app.use(express.json());
app.use(express.static("public"));

// 🔥 API KEY KONTROL (CRASH YOK)
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("✅ OpenAI aktif");
} else {
  console.log("⚠️ OPENAI_API_KEY yok → AI devre dışı");
}

// 🔥 ENDPOINT
app.post("/api/generate-idea", async (req, res) => {
  try {
    const { idea } = req.body;

    // 🔥 AI yoksa fallback (CRASH ENGEL)
    if (!openai) {
      return res.json({
        result: `Mock fikir: "${idea}" için bir SaaS aracı oluştur.`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a SaaS startup expert.",
        },
        {
          role: "user",
          content: `Give me a SaaS idea based on this: ${idea}`,
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("API ERROR:", err);

    // 🔥 CRASH YERİNE RESPONSE
    res.status(500).json({
      result: "AI hata verdi ama sistem ayakta.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});