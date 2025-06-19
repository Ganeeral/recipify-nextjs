// models/favorite.go
package models

import (
	"time"
)

// Favorite — связь «пользователь ↔ рецепт» (избранное).
type Favorite struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;index"`
	RecipeID  uint      `gorm:"not null;index"`
	Recipe    Recipes   `gorm:"foreignKey:RecipeID;references:ID"` // ← связываем Favorite.RecipeID c Recipes.ID
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
