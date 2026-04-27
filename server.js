const express = require("express");
const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { idea } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir startup fikir geliştirme uzmanısın. Kullanıcı fikrini geliştir ve 5 net öneri ver."
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
    res.status(500).json({ error: "AI hata verdi" });
  }
});

app.listen(3000);
console.log("KEY:", process.env.OPENAI_API_KEY);
