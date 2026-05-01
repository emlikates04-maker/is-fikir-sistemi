import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

let client = null;

// OPENAI SAFE INIT (CRASH ENGELLER)
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("OPENAI_API_KEY missing!");
}

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.post("/api/generate-idea", async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({
        error: "OPENAI_API_KEY not set on server",
      });
    }

    const prompt = req.body?.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    res.json({
      idea: response.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "OpenAI request failed",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER OK");
});