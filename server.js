const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir fikir geliştirme uzmanısın."
        },
        {
          role: "user",
          content: idea
        }
      ]
    });

    res.json({
      result: response.choices[0].message.content
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});