import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

console.log("BOOT OK");

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.listen(PORT, () => {
  console.log("RUNNING", PORT);
});
app.use(express.json());
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
        { role: "system", content: "You generate SaaS ideas." },
        { role: "user", content: prompt }
      ]
    });

    res.json({
      idea: response.choices[0].message.content
    });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.status(500).json({ error: "AI failed", details: err.message });
  }
});