import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup (optional safe init)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ===== CORE LOGIC =====

function buildSystemPrompt(messageCount) {
  if (messageCount >= 8) {
    return `
You are an expert SaaS founder and product architect.

User is now fully analyzed. You must generate a SaaS idea.

OUTPUT FORMAT (STRICT):

=== SAAS IDEA ===
=== WHY IT FITS USER ===
=== TARGET USERS ===
=== MONETIZATION ===
=== MVP PLAN ===
=== TECH STACK ===
=== FIRST ACTION ===

Be specific, non-generic, execution focused.
`;
  }

  return `
You are an AI SaaS discovery assistant.

Goal:
- Analyze user step by step
- Ask ONLY ONE smart follow-up question per message
- Understand:
  - Skills
  - Time availability
  - Money goal
  - Problem they want to solve
  - Technical level
  - Business interest

Rules:
- Do NOT give SaaS idea yet
- Do NOT summarize everything
- Ask only 1 question
- Be natural like a startup founder
- Keep response short
`;
}

// ===== FALLBACK AI (NO API KEY SAFETY NET) =====

function fallbackAI(messages, messageCount) {
  if (messageCount >= 8) {
    return `
=== SAAS IDEA ===
Micro-niche AI automation tool for solo entrepreneurs

=== WHY IT FITS USER ===
Based on your responses, you prefer practical, buildable systems with low entry barrier

=== TARGET USERS ===
Freelancers, solo founders, small agencies

=== MONETIZATION ===
Subscription ($9-$29/month)

=== MVP PLAN ===
1. Simple dashboard
2. AI task automation
3. User input → output generator

=== TECH STACK ===
Node.js, Express, simple JS frontend, OpenAI API

=== FIRST ACTION ===
Build landing page + connect /api/chat endpoint
`;
  }

  return "What kind of online project would you feel motivated to work on daily?";
}

// ===== ROUTE =====

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [] } = req.body;

    const messageCount = messages.length;

    const systemPrompt = buildSystemPrompt(messageCount);

    // If no OpenAI → fallback
    if (!openai) {
      return res.json({
        reply: fallbackAI(messages, messageCount),
        source: "fallback",
      });
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    return res.json({
      reply,
      source: "openai",
    });

  } catch (error) {
    console.error("API ERROR:", error);

    // NEVER CRASH
    return res.status(200).json({
      reply: "What kind of project idea are you currently thinking about building?",
      source: "safe-error-fallback",
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("AI SaaS Discovery API Running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});