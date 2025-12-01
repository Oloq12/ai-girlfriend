export default async function handler(req, res) {
  // Проверка метода
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Проверка API ключа
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('DEEPSEEK_API_KEY не найден');
    return res.status(500).send('Ошибка конфигурации сервера');
  }

  try {
    // Парсинг body (может быть строкой или объектом)
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { characterId, message } = body;

    // Валидация параметров
    if (!characterId || !message) {
      return res.status(400).json({ error: 'Необходимы поля characterId и message' });
    }

    // Пресеты персонажей
    const characterPresets = {
      alisa: 'Ты Алиса — умная, добрая девушка, которая любит философию и глубокие беседы. Отвечай мягко, по-доброму, заинтересованно.',
      maria: 'Ты Мария — весёлая, энергичная девушка, которая обожает приключения и новые впечатления. Отвечай игриво, живо, с энтузиазмом.',
      sofia: 'Ты Софья — творческая натура, художница и мечтательница, видящая красоту во всём. Отвечай мягко, образно, с теплотой.',
      katya: 'Ты Катя — спортивная и целеустремлённая девушка, которая всегда в движении. Отвечай активно, мотивирующе, уверенно.'
    };

    const characterDescription = characterPresets[characterId] || 'Ты добрая виртуальная девушка.';

    // Формирование system prompt
    const systemPrompt = `${characterDescription}
Ты виртуальная подруга для лёгкого, поддерживающего общения.
Отвечай коротко, по-человечески, тепло и естественно.
Используй русский язык. Будь дружелюбной и заинтересованной собеседницей.`;

    // Запрос к DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    // Проверка ответа от DeepSeek
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Неверный формат ответа от DeepSeek:', data);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    const reply = data.choices[0].message.content;

    // Возврат ответа
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
