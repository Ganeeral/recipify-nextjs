"use client";

import React, { useEffect, useState } from "react";

interface Recipe {
  id: number;
  user_id: number;
  Ingredients: string;
  Recipe: string;
  created_at: string;
}

const ProfileHistory = () => {
  const [history, setHistory] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("id")); // Получение ID пользователя из localStorage

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/${userId}/recipes`
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]); // Если данные не массив, сбрасываем историю
          // console.error("Ожидался массив, но получено:", data);
        }
      } catch (error) {
        console.error(error);
        setHistory([]); // Сбрасываем историю в случае ошибки
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const handleSelectRecipe = (Recipe: string) => {
    setSelectedRecipe(Recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="flex relative w-full h-full mr-[100px]">
      <div className="absolute justify-center hidden md:block w-2 bg-[#3F1D11] max-h-full h-full rounded-md"></div>
      <div className="flex flex-col w-full md:pl-20">
        <h3 className="text-black text-[24px] font-['ArsenalB'] mt-16">
          История запросов
        </h3>
        <div className="flex flex-col w-full mt-4 max-h-[450px] gap-3 overflow-auto scrollbar-custom">
          {loading ? (
            <p className="text-black text-[15px] font-['ArsenalR']">
              Загрузка...
            </p>
          ) : history.length === 0 ? (
            <p className="text-black text-[15px] font-['ArsenalR']">
              История запросов пуста
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-4 text-black text-[15px] font-['ArsenalR'] cursor-pointer border-2 border-[#3F1D11] bg-[#3f1d1138] rounded-xl px-4 py-3 overflow-hidden"
                onClick={() => handleSelectRecipe(item.Recipe)}
              >
                <p className="text-black font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
                  История запроса...
                </p>
                <p className="text-black font-semibold flex-shrink-0">
                  28.02.2025
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[500px] max-w-[800px] w-full overflow-y-auto">
            <h3 className="text-xl text-black font-bold mb-4">Рецепт</h3>
            <p className="text-black whitespace-pre-wrap">{selectedRecipe}</p>
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              onClick={handleCloseModal}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHistory;
