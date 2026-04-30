import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("public"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// AI ENDPOINT
app.post("/api/generate-idea", async (req, res) => {
  try {
    const OpenAI = (await import("openai")).default;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt gerekli" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a SaaS idea generator." },
        { role: "user", content: prompt }
      ]
    });

    res.json({
      idea: response.choices[0].message.content
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed", details: err.message });
  }
});