import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TEST sayfa
app.get("/", (req, res) => {
  res.send("SaaS MVP running 🚀");
});

// AI endpoint
app.post("/api/generate-idea", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea gerekli" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir SaaS fikir danışmanısın. Kısa ve net öneri ver.",
        },
        {
          role: "user",
          content: idea,
        },
      ],
    });

    res.json({
      success: true,
      suggestion: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({
      error: "AI çalışmadı",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});