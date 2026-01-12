import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔑 حط مفتاح OpenAI هنا
const OPENAI_API_KEY = "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";

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          size: "1024x1024"
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ AI Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
