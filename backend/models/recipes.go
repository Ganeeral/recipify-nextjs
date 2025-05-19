package models

import (
	"time"
)

type Recipes struct {
	ID            uint   `gorm:"primaryKey"`
	UserID        uint   `gorm:"not null"`
	Recipe         string `gorm:"not null"`
	Ingredients       string `gorm:"not null"`
	CreationDate  time.Time
	User          User `gorm:"foreignKey:UserID"`
}
