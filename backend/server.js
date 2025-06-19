
const { OpenAI } = require("openai");
// const { createDeepSeek } = require("@ai-sdk/deepseek");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

app.post("/generate-recipe", async (req, res) => {
  const { ingredients } = req.body;

  try {
    const prompt = `
    Ты — профессиональный шеф-повар. Твоя задача — анализировать предоставленные ингредиенты и создавать кулинарные рецепты ТОЛЬКО если все ингредиенты съедобны.

    Строгие правила:
    1. Сначала определи, являются ли ВСЕ ингредиенты съедобными продуктами. Проверь каждый ингредиент отдельно.
    2. Если обнаружены явно несъедобные элементы (например, "ашщз", "камни", "пластик") или бессмысленный набор символов:
        - Ответь ТОЛЬКО: "Пожалуйста, введите съедобные ингредиенты."
        - Не предлагай рецепт
        - Не добавляй пояснений
    3. Для съедобных ингредиентов:
        - Создай рецепт в строгом формате без лишних символов
        - Убери все markdown (**, plaintext и т.д.)
        - Используй только обычный текст с разделением на строки

    Формат для валидных ингредиентов:
    Название: [Название блюда]
    Ингредиенты: [список]
    Приготовление:
    1. [Шаг 1]
    2. [Шаг 2]
    Совет: [короткая рекомендация]

    Текущие ингредиенты: "${ingredients}"

    Будь креативным, но сохраняй реалистичность рецепта!
`;

    const result = await openai.chat.completions.create({
      model: "mistralai/devstral-small:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = result.choices[0].message.content.trim();

    res.json({ recipe: aiResponse });
  } catch {
    res.status(500).json({ error: "Failed to analyze scene" });
  }
});

app.listen(5001, () => {
  console.log("AI Server running on port 5000");
});
