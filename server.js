const express = require("express");
const app = express();
const OpenAI = require("openai");

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/generate-idea", async (req, res) => {
  try {
    const idea = req.body.idea;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a startup advisor.

User idea: ${idea}

Return JSON only:
{
  "improvement": "string",
  "risks": ["string"],
  "monetization": ["string"],
  "mvp": "string"
}
`
    });

    let text = response.output_text;

    // güvenli parse (crash önler)
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const clean = text.slice(jsonStart, jsonEnd);

    res.json(JSON.parse(clean));

  } catch (err) {
    console.error(err);
    res.status(500).json({
      improvement: "Error",
      risks: [],
      monetization: [],
      mvp: "Fix required"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));