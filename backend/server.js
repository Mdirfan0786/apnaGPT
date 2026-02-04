import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

app.post("/test", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: req.body.message }],
      }),
    });

    const data = await response.json();

    console.log("AI REPLY:", data.choices[0].message.content);

    res.json({
      reply: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const response = await client.responses.create({
//   model: "gpt-4.1-mini",
//   input: "ek joke suna wo bhi hinglish me",
// });

// console.log(response.output_text);
