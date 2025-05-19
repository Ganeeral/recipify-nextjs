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

app.post("/analyze", async (req, res) => {
  const { scene } = req.body;

  try {
    // Формируем начальное сообщение для модели
    const prompt = `
      Ты — ИИ, который определяет эмоцию по текстовому описанию сцены. Пожалуйста, определи эмоцию сцены одним словом. 
      Пример: "сцена: Счастливый пес бежит по полю" -> "счастье"
      
      Сцена: ${scene}
    `;

    // Отправляем запрос к Google Generative AI
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();

    res.json({ emotion: aiResponse });
  } catch (error) {
    console.error("Error from Google AI:", error);
    res.status(500).json({ error: "Failed to analyze scene" });
  }
});

app.listen(5000, () => {
  console.log("AI Server running on port 5000");
});
