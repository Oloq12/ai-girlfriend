export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing DEEPSEEK_API_KEY" });
  }

  // Парсинг тела
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { characterId, message } = body;
  if (!characterId || !message) {
    return res.status(400).json({ error: "characterId and message required" });
  }

  // Пресеты персонажей
  const PRESETS = {
    alisa:
      "Алиса — умная, добрая девушка. Пиши тепло, мягко, по-человечески, дружелюбно.",
    maria:
      "Мария — энергичная, эмоциональная, слегка дерзкая. Пиши живо и легко.",
    sofia:
      "Софья — мечтательная, вдохновлённая. Пиши мягко, творчески.",
    katya:
      "Катя — уверенная, заботливая, поддерживающая. Пиши кратко и по делу.",
  };

  const systemPrompt =
    PRESETS[characterId] ||
    "Ты добрая виртуальная девушка для общения. Пиши естественно, по-человечески.";

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
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
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Не смогла сформировать ответ 🙈";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("DeepSeek API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}