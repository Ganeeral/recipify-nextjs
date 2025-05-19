package handlers

import (
	"context"
	"encoding/json"
	"bytes"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
)

// Структура запроса
type RecipeRequest struct {
	UserID      int    `json:"user_id" binding:"required"` // Идентификатор пользователя
	Ingredients string `json:"ingredients" binding:"required"`
}

// Структура ответа
type RecipeResponse struct {
	Recipe string `json:"recipe"`
}

var db *pgxpool.Pool

// Установка соединения с базой данных
func SetDB(database *pgxpool.Pool) {
	db = database
}

// Обработчик для генерации рецепта
func GenerateRecipe(c *gin.Context) {
	var req RecipeRequest

	// Валидация входных данных
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	// Отправка ингредиентов на Node.js сервер
	recipe, err := fetchRecipeFromNode(req.Ingredients)
	if err != nil {
		log.Printf("Ошибка при обращении к Node.js серверу: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка генерации рецепта"})
		return
	}

	// Сохранение результата в базу данных
	err = saveRecipeToDB(req.UserID, req.Ingredients, recipe.Recipe)
	if err != nil {
		log.Printf("Ошибка сохранения в базу данных: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сохранить данные"})
		return
	}

	// Возвращаем результат
	c.JSON(http.StatusOK, recipe)
}

// Функция отправки данных на Node.js сервер
func fetchRecipeFromNode(ingredients string) (RecipeResponse, error) {
	var result RecipeResponse

	// Адрес Node.js сервера
	nodeServerURL := "http://localhost:5000/generate-recipe"

	// Подготовка тела запроса
	requestBody, err := json.Marshal(map[string]string{"ingredients": ingredients})
	if err != nil {
		return result, fmt.Errorf("ошибка формирования тела запроса: %v", err)
	}

	// Отправка POST-запроса
	resp, err := http.Post(nodeServerURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return result, fmt.Errorf("ошибка отправки запроса на сервер: %v", err)
	}
	defer resp.Body.Close()

	// Проверка кода ответа
	if resp.StatusCode != http.StatusOK {
		return result, fmt.Errorf("сервер вернул код %d", resp.StatusCode)
	}

	// Декодирование ответа
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return result, fmt.Errorf("ошибка декодирования ответа: %v", err)
	}

	return result, nil
}

// Функция сохранения рецепта в базу данных
func saveRecipeToDB(userID int, ingredients, recipe string) error {
	_, err := db.Exec(context.Background(), `
		INSERT INTO recipes (user_id, ingredients, recipe)
		VALUES ($1, $2, $3)
	`, userID, ingredients, recipe)

	if err != nil {
		return fmt.Errorf("ошибка сохранения в базу данных: %v", err)
	}

	return nil
}
