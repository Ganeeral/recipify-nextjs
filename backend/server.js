const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Инициализация Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyCNXTd8Q583IcEddDWX3BBr95-Bz5kZa2U");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MAX_RETRIES = 3; // Максимальное количество попыток
const RETRY_DELAY = 3000; // Задержка между попытками (3 секунды)

async function generateRecipeWithRetries(prompt, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Попытка сгенерировать контент
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            // Если это не ошибка 503 или превышен лимит попыток, выбрасываем её
            if (error.status !== 503 || attempt === retries) {
                throw error;
            }
            console.warn(`Попытка ${attempt} из ${retries} не удалась. Повтор через ${RETRY_DELAY / 1000} секунд...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Задержка перед повтором
        }
    }
}

app.post("/generate-recipe", async (req, res) => {
    const { ingredients } = req.body;

    const prompt = `
      Ты — ИИ, который создает уникальные рецепты на основе доступных ингредиентов. Пользователь ввел список ингредиентов: "${ingredients}".
      Пожалуйста, предложи другое блюдо, которое можно приготовить, и напиши подробный рецепт. Ты должен выводить только те рецепты, которые съедобны для человека. Если пользователь ввел несъедобные игредиенты, то выводи - "Введите съедобные игредиенты."
      Формат ответа:
      Название блюда: [название]
      Рецепт:
      [инструкция]
    `;

    try {
        const recipe = await generateRecipeWithRetries(prompt);
        res.json({ recipe });
    } catch (error) {
        console.error("Ошибка Google AI:", error);
        res.status(error.status || 500).json({
            error: "Не удалось сгенерировать рецепт. Попробуйте еще раз чуть позже.",
        });
    }
});


app.listen(5000, () => {
  console.log("AI Server running on port 5000");
});
