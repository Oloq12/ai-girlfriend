import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  console.error("❌ Ошибка: DEEPSEEK_API_KEY не найден в .env");
  process.exit(1);
}

const CHARACTER_PRESETS = {
  alisa: "Алиса — умная, добрая девушка. Она любит философию, отвечает мягко, по-доброму.",
  maria: "Мария — энергичная, яркая, любит приключения. Отвечает игриво и живо.",
  sofia: "Софья — творческая, мечтательная, художница. Отвечает мягко и образно.",
  katya: "Катя — спортивная, целеустремлённая, уверенная. Отвечает активно и мотивирующе."
};

app.post("/api/chat", async (req, res) => {
  try {
    const { characterId, message } = req.body;

    if (!characterId || !message) {
      return res.status(400).json({ error: "Отсутствуют параметры" });
    }

    const preset = CHARACTER_PRESETS[characterId] || "Добрая виртуальная девушка";

    const systemPrompt = `
Ты — виртуальная девушка. Твой стиль: эмоциональная, человечная речь, без слишком длинных ответов.
Твоя роль: ${preset}
Отвечай на русском языке.`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ]
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("DeepSeek error:", data);
      return res.status(500).json({ error: "Ошибка DeepSeek" });
    }

    const reply = data.choices[0].message.content;

    return res.json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(4000, () => {
  console.log("🚀 DeepSeek сервер запущен на порту 4000");
});