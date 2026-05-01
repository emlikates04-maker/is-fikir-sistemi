import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// JSON middleware (çok kritik)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenAI client (crash önleyici güvenli kurulum)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// AI ENDPOINT
app.post("/api/generate-idea", async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt gerekli"
      });
    }

    // OpenAI request
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a SaaS idea generator. Give creative, practical startup ideas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
    });

    const idea = response.choices?.[0]?.message?.content;

    return res.json({
      success: true,
      idea: idea || "No idea generated"
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "AI request failed",
      details: error.message
    });
  }
});

// PORT (Render uyumlu)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER OK");
});