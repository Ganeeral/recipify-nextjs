package main

import (
	"context"
	"log"
	"time"

	"github.com/azaliya25/Recipify/database"
	"github.com/azaliya25/Recipify/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
)

func main() {

	connString := "postgresql://postgres:0897187526@localhost:5432/Recipify"
	db, err := pgxpool.Connect(context.Background(), connString)
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v", err)
	}
	defer db.Close()

	// Передача подключения обработчику
	handlers.SetDB(db)

	database.ConnectDB()

	r := gin.Default()
	auth := r.Group("/")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	auth.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	users := r.Group("/users")
	{
		users.GET("/:id", handlers.GetUser)
		users.PUT("/:id", handlers.UpdateUser)
		// Смена пароля:
		users.PUT("/:id/password", handlers.ChangePassword)
	}

	r.GET("/user/:id/recipes", handlers.GetUserRecipes)

	r.POST("/register", handlers.RegisterUser)
	r.POST("/login", handlers.Login)
	r.POST("/generate-recipe", handlers.GenerateRecipe)

	favs := r.Group("/users/:id/favorites")
	{
		favs.GET("", handlers.GetFavorites)             // GET /users/:id/favorites
		favs.POST("", handlers.AddFavorite)             // POST /users/:id/favorites
		favs.DELETE("/:favId", handlers.RemoveFavorite) // DELETE /users/:id/favorites/:favId
	}

	r.Run(":8081")
}
