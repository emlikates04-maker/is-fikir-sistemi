import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body support
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// AI ROUTE (SAFE)
app.post("/api/generate-idea", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt gerekli" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY missing in Render env"
      });
    }

    const OpenAI = (await import("openai")).default;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a SaaS idea generator. Give short, practical startup ideas."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    res.json({
      idea: response.choices[0].message.content
    });

  } catch (err) {
    console.log("AI ERROR:", err);

    res.status(500).json({
      error: "AI request failed",
      details: err.message
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log("RUNNING ON", PORT);
});