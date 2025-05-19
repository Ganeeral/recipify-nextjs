package handlers

import (
	"net/http"
	"strconv"

	"github.com/azaliya25/Recipify/database"
	"github.com/azaliya25/Recipify/models"
	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	var input struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Name = input.Name
	user.Email = input.Email

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при сохранении данных"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUserRecipes(c *gin.Context) {
    userID, err := strconv.Atoi(c.Param("id")) // Конвертация ID пользователя в число
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID пользователя"})
        return
    }

    var recipes []models.Recipes
    // Использование GORM для получения данных
    if err := database.DB.Where("user_id = ?", userID).Find(&recipes).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения данных из базы"})
        return
    }

    // Если рецепты не найдены
    if len(recipes) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"message": "История запросов пуста"})
        return
    }

    c.JSON(http.StatusOK, recipes)
}
