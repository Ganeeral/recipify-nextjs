"use client";

import React, { useEffect, useState } from "react";
import HeartIcon from "public/heart.svg";

interface Recipe {
  ID: number;
  user_id: number;
  Ingredients: string;
  Recipe: string;
  created_at: string;
}

interface Favorite {
  id: number; // ID строки в таблице favorites
  recipe_id: number; // ID рецепта
}

const ProfileHistory: React.FC = () => {
  const [history, setHistory] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const userId = Number(localStorage.getItem("id")); // ID пользователя

  useEffect(() => {
    // Получаем историю запросов
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `https://delico-backend.cloudpub.ru/user/${userId}/recipes`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const cleanedData = data.map((item: Recipe) => ({
            ...item,
            Recipe: item.Recipe.replace(/\*\*\*|```|plaintext/g, "").trim(),
          }));
          setHistory(cleanedData);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error(error);
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    // Получаем список избранного
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `https://delico-backend.cloudpub.ru/users/${userId}/favorites`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // data: [{ id, recipe_id, recipe, ingredients, created_at }, ...]
            // Оставим только ID-ы для дальнейшей сверки
            const favs = data.map((f: any) => ({
              id: f.id,
              recipe_id: f.recipe_id,
            }));
            setFavorites(favs);
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error(error);
        setFavorites([]);
      } finally {
        setLoadingFavs(false);
      }
    };

    fetchHistory();
    fetchFavorites();
  }, [userId]);

  // Проверка, находится ли конкретный рецепт в избранном
  const isFavorite = (recipeId: number) => {
    return favorites.some((f) => f.recipe_id === recipeId);
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = async (recipeId: number) => {
    try {
      const response = await fetch(
        `https://delico-backend.cloudpub.ru/users/${userId}/favorites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipe_id: recipeId }),
        }
      );
      if (response.ok) {
        // Вдруг бэкенд вернёт новый ID избранного, можно обновить список
        const resData = await response.json();
        if (resData.favorite_id) {
          setFavorites((prev) => [
            ...prev,
            { id: resData.favorite_id, recipe_id: recipeId },
          ]);
        } else {
          // Если бэкенд просто вернул сообщение, обновим, сделав ре-фетч
          const favsResponse = await fetch(
            `https://delico-backend.cloudpub.ru/users/${userId}/favorites`
          );
          const favsData = await favsResponse.json();
          const favs = Array.isArray(favsData)
            ? favsData.map((f: any) => ({
                id: f.id,
                recipe_id: f.recipe_id,
              }))
            : [];
          setFavorites(favs);
        }
      } else {
        console.error("Не удалось добавить в избранное");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Обработчик удаления из избранного (опционально)
  const handleRemoveFromFavorites = async (recipeId: number) => {
    // Найдём соответствующую запись в favorites, чтобы получить favId
    const favObj = favorites.find((f) => f.recipe_id === recipeId);
    if (!favObj) return;

    try {
      const response = await fetch(
        `https://delico-backend.cloudpub.ru/users/${userId}/favorites/${favObj.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.recipe_id !== recipeId));
      } else {
        console.error("Не удалось удалить из избранного");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectRecipe = (Recipe: string) => {
    setSelectedRecipe(Recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="relative w-full h-full px-4 md:px-0">
      <div className="flex flex-col w-full  h-full">
        {/* Контейнер для списка с фиксированной высотой и прокруткой */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 pb-4">
            {loadingHistory ? (
              <p className="text-black text-base font-['ArsenalR']">
                Загрузка...
              </p>
            ) : history.length === 0 ? (
              <p className="text-black text-base font-['ArsenalR']">
                История запросов пуста
              </p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-4 text-black text-sm sm:text-base py-3 font-['ArsenalR'] cursor-pointer border-2 border-[#3F1D11] bg-[#3f1d1138] rounded-xl px-3 sm:px-4 hover:bg-[#3f1d1160] transition-colors"
                >
                  <div
                    className="overflow-hidden max-w-full text-ellipsis flex-1 line-clamp-2 sm:line-clamp-1 cursor-pointer"
                    onClick={() => handleSelectRecipe(item.Recipe)}
                  >
                    {item.Recipe}
                  </div>

                  {!loadingFavs && (
                    <div
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие события
                    >
                      {isFavorite(item.ID) ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromFavorites(item.ID);
                          }}
                          className="text-red-500 hover:opacity-80"
                          title="Убрать из избранного"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#3F1D11"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.7048 4C14.2595 4.00092 12.9493 4.5499 11.996 5.4363C11.0403 4.55302 9.72923 4.00715 8.28239 4.0088C5.36182 4.01173 2.99747 6.24265 3 8.98958C3.00633 13.7599 8.1511 17.6087 10.6638 19.2041C11.4937 19.7311 12.5316 19.73 13.3604 19.2012C15.87 17.6002 21.0074 13.7394 21 8.9676C20.9963 6.22048 18.6261 3.99689 15.7048 4Z"
                              stroke="#3F1D11"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToFavorites(item.ID); // Исправлено на handleAddToFavorites
                          }}
                          className="hover:opacity-80"
                          title="Добавить в избранное"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.7048 4C14.2595 4.00092 12.9493 4.5499 11.996 5.4363C11.0403 4.55302 9.72923 4.00715 8.28239 4.0088C5.36182 4.01173 2.99747 6.24265 3 8.98958C3.00633 13.7599 8.1511 17.6087 10.6638 19.2041C11.4937 19.7311 12.5316 19.73 13.3604 19.2012C15.87 17.6002 21.0074 13.7394 21 8.9676C20.9963 6.22048 18.6261 3.99689 15.7048 4Z"
                              stroke="#3F1D11"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={handleCloseModal}>
          <div className="backdrop-invert blur__banner bg-[#dabf94e6] rounded-lg p-4 sm:p-6 shadow-lg max-h-[60vh] mt-[50px] w-full max-w-5xl overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-lg sm:text-xl text-black font-bold mb-4">
                Рецепт
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#3F1D11"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-black whitespace-pre-wrap text-sm sm:text-base">
              {selectedRecipe}
            </p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHistory;
