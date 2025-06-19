// файл: handlers/favorites.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/azaliya25/Recipify/database"
	"github.com/azaliya25/Recipify/models"
	"github.com/gin-gonic/gin"
)


func AddFavorite(c *gin.Context) {

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID пользователя"})
		return
	}
	var input struct {
		RecipeID uint `json:"recipe_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный JSON: " + err.Error()})
		return
	}

	var recipe models.Recipes
	if err := database.DB.First(&recipe, input.RecipeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Рецепт не найден"})
		return
	}

	var existing models.Favorite
	if err := database.DB.
		Where("user_id = ? AND recipe_id = ?", userID, input.RecipeID).
		First(&existing).Error; err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "Уже в избранном"})
		return
	}

	fav := models.Favorite{
		UserID:   uint(userID),
		RecipeID: input.RecipeID,
	}
	if err := database.DB.Create(&fav).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось добавить в избранное"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Добавлено в избранное", "favorite_id": fav.ID})
}


func GetFavorites(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID пользователя"})
		return
	}


	var favorites []models.Favorite
	if err := database.DB.
		Where("user_id = ?", userID).
		Preload("Recipe"). // чтобы получить поля рецепта
		Find(&favorites).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении избранного"})
		return
	}


	type FavResponse struct {
		ID          uint   `json:"id"`
		RecipeID    uint   `json:"recipe_id"`
		Recipe      string `json:"recipe"`
		Ingredients string `json:"ingredients"`
		CreatedAt   string `json:"created_at"`
	}

	result := make([]FavResponse, 0, len(favorites))
	for _, f := range favorites {
		var r models.Recipes
		// Первая загрузка: поскольку в Preload мы указали "Recipe", но GORM ожидает, что в модели Favorite
		// будет поле `Recipe   Recipes  gorm:"foreignKey:RecipeID"`. Если у вас связь не настроена, можно
		// просто отдельно выбрать:
		if err := database.DB.First(&r, f.RecipeID).Error; err != nil {
			continue // пропустим, если рецепт вдруг удалили
		}
		result = append(result, FavResponse{
			ID:          f.ID,
			RecipeID:    f.RecipeID,
			Recipe:      r.Recipe,
			Ingredients: r.Ingredients,
			CreatedAt:   f.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, result)
}

// RemoveFavorite — удаление из избранного (по ID favorite или по userID+recipeID)
// Например: DELETE /users/:id/favorites/:favId
func RemoveFavorite(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID пользователя"})
		return
	}
	favID, err := strconv.Atoi(c.Param("favId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID избранного"})
		return
	}

	// Проверим, что запись существует и принадлежит данному пользователю
	var fav models.Favorite
	if err := database.DB.First(&fav, favID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Избранное не найдено"})
		return
	}
	if fav.UserID != uint(userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Нет доступа к этой записи"})
		return
	}
	if err := database.DB.Delete(&fav).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось удалить из избранного"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Удалено из избранного"})
}
