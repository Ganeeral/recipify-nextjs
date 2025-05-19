package main

import (
	"github.com/azaliya25/Recipify/database"
	"github.com/azaliya25/Recipify/models"
)

func main() {
	// Подключаемся к базе данных
	database.ConnectDB()

	// Миграция моделей (создание таблиц)
	database.DB.AutoMigrate(&models.User{}, &models.Recipes{})
}
