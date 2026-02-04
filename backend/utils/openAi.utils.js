import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options,
    );

    const data = await response.json();

    return {
      reply: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
    };
  } catch (err) {
    console.error("OpenAI Error:", err);
    throw new Error("OpenAI API failed");
  }
};

export default getOpenAIAPIResponse;
