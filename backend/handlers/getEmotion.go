package handlers

import (
	"bytes"
	"context"
	"encoding/json"
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


if err := c.ShouldBindJSON(&req); err != nil {
	log.Printf("Ошибка биндинга: %v", err)
	c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
	return
}

log.Printf("Получен запрос от user_id=%d с ингредиентами: %s", req.UserID, req.Ingredients)

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


func fetchRecipeFromNode(ingredients string) (RecipeResponse, error) {
	var result RecipeResponse


	nodeServerURL := "https://ai-backend-delico.cloudpub.ru/generate-recipe"


	requestBody, err := json.Marshal(map[string]string{"ingredients": ingredients})
	if err != nil {
		return result, fmt.Errorf("ошибка формирования тела запроса: %v", err)
	}


	resp, err := http.Post(nodeServerURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return result, fmt.Errorf("ошибка отправки запроса на сервер: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return result, fmt.Errorf("сервер вернул код %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return result, fmt.Errorf("ошибка декодирования ответа: %v", err)
	}

	return result, nil
}


func saveRecipeToDB(userID int, ingredients, recipe string) error {
    // Проверяем существование пользователя
    var exists bool
    err := db.QueryRow(context.Background(), 
        "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", userID).Scan(&exists)
    
    if err != nil {
        return fmt.Errorf("ошибка проверки пользователя: %v", err)
    }
    
    if !exists {
        return fmt.Errorf("пользователь с ID %d не существует", userID)
    }

    // Вставляем рецепт
    _, err = db.Exec(context.Background(), `
        INSERT INTO recipes (user_id, ingredients, recipe)
        VALUES ($1, $2, $3)
    `, userID, ingredients, recipe)

    if err != nil {
        return fmt.Errorf("ошибка сохранения в базу данных: %v", err)
    }

    return nil
}
