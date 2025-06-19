// файл: components/ProfileFavorites.tsx
"use client";

import React, { useEffect, useState } from "react";

interface FavoriteItem {
  id: number; // ID строки в таблице favorites
  recipe_id: number; // ID рецепта
  recipe: string; // текст промпта
  ingredients: string; // текст ингредиентов (если нужно)
  created_at: string;
}

const ProfileFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const userId = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `https://delico-backend.cloudpub.ru/users/${userId}/favorites`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFavorites(
              data.map((f: any) => ({
                id: f.id,
                recipe_id: f.recipe_id,
                recipe: f.recipe,
                ingredients: f.ingredients,
                created_at: f.created_at,
              }))
            );
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

    fetchFavorites();
  }, [userId]);

  const handleRemove = async (favId: number) => {
    try {
      const response = await fetch(
        `https://delico-backend.cloudpub.ru/users/${userId}/favorites/${favId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== favId));
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
    <div className="flex relative w-full h-full mr-[100px]">
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full mt-4 max-h-[450px] gap-3 overflow-auto scrollbar-custom">
          {loadingFavs ? (
            <p className="text-black text-[15px] font-['ArsenalR']">
              Загрузка...
            </p>
          ) : favorites.length === 0 ? (
            <p className="text-black text-[15px] font-['ArsenalR']">
              Избранных запросов нет
            </p>
          ) : (
            favorites.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-4 text-black text-sm sm:text-base py-3 font-['ArsenalR'] cursor-pointer border-2 border-[#3F1D11] bg-[#3f1d1138] rounded-xl px-3 sm:px-4 hover:bg-[#3f1d1160] transition-colors"
              >
                <div
                  className="overflow-hidden max-w-full text-ellipsis flex-1 line-clamp-2 sm:line-clamp-1 cursor-pointer"
                  onClick={() => handleSelectRecipe(item.recipe)}
                >
                  {item.recipe}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item.id);
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
              </div>
            ))
          )}
        </div>
      </div>
      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
          onClick={handleCloseModal}
        >
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

export default ProfileFavorites;
