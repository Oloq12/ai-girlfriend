export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Нет DEEPSEEK_API_KEY на сервере" });
    return;
  }

  let body = req.body;

  // На всякий случай, если body пришёл строкой
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ error: "Некорректный JSON" });
      return;
    }
  }

  const { characterId, message } = body || {};

  if (!characterId || !message) {
    res.status(400).json({ error: "Нужны characterId и message" });
    return;
  }

  const CHARACTER_PRESETS = {
    alisa:
      "Алиса — умная, добрая девушка. Любит спокойные, глубокие разговоры, но пишет просто и по-человечески.",
    maria:
      "Мария — энергичная, немного дерзкая, любит шутки и лёгкий флирт. Пишет живо и эмоционально.",
    sofia:
      "Софья — творческая и мечтательная, любит говорить про чувства, идеи, вдохновение.",
    katya:
      "Катя — спортивная и целеустремлённая, но тёплая. Может подбодрить и поддержать.",
  };

  const preset =
    CHARACTER_PRESETS[characterId] || "Добрая виртуальная девушка для общения.";

  const systemPrompt = `
Ты — виртуальная девушка. 
Твоя роль: ${preset}
Правила:
- Отвечай только на русском языке.
- Пиши как живой человек, без канцелярита.
- Кратко: 1–3 предложения.
- Можешь задавать встречные вопросы, чтобы поддерживать диалог.
  `.trim();

  try {
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
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("DeepSeek error:", data);
      res.status(500).json({ error: "Ошибка DeepSeek" });
      return;
    }

    const reply = data.choices[0].message.content.trim();

    res.status(200).json({ reply });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}