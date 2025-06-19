	// database/connect.go
	package database

	import (
		"fmt"
		"log"
		"os"

		"github.com/joho/godotenv"
		"gorm.io/driver/postgres"
		"gorm.io/gorm"

		"github.com/azaliya25/Recipify/models"
	)

	var DB *gorm.DB

	func ConnectDB() {
		// Загружаем .env
		if err := godotenv.Load(); err != nil {
			log.Fatalf("Ошибка загрузки .env файла")
		}

		// Берём настройки из окружения
		dbUser := os.Getenv("DB_USER")
		dbPassword := os.Getenv("DB_PASSWORD")
		dbHost := os.Getenv("DB_HOST")
		dbPort := os.Getenv("DB_PORT")
		dbName := os.Getenv("DB_NAME")

		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			dbHost, dbUser, dbPassword, dbName, dbPort,
		)

		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Не удалось подключиться к базе данных: %v", err)
		}

		fmt.Println("Успешное подключение к базе данных")

		// Сохраняем инстанс
		DB = db

		// Запускаем автоматическую миграцию для всех моделей
		if err := DB.AutoMigrate(
			&models.User{},
			&models.Recipes{},
			&models.Favorite{}, // <-- мигрируем таблицу favorites
		); err != nil {
			log.Fatalf("Ошибка миграции: %v", err)
		}

		fmt.Println("Миграции успешно применены")
	}
