"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchAi = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      toast.warn("Введите ингредиенты!", { position: "top-center" });
      return;
    }

    const userID = Number(localStorage.getItem("id")); // Получаем user_id из локального хранилища

    if (!userID) {
      toast.error("Авторизируйтесь перед тем как сгенерировать рецепт!", {
        position: "top-center",
      });
      return;
    }

    setErrorMessage(""); // Сбрасываем сообщение об ошибке перед запросом
    try {
      const response = await fetch("http://localhost:8080/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userID, ingredients }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Серверная ошибка");
        }
        throw new Error("Ошибка при получении рецепта");
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Не удалось сгенерировать рецепт. Попробуйте еще раз чуть позже."
      );
    }
  };

  const handleGenerateNew = () => {
    setRecipe("");
    handleSearch();
  };

  return (
    <div className="flex flex-col items-center w-full mt-10 px-4">
      <ToastContainer />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex justify-center items-center font-['ArsenalR'] w-full text-[#DABF94] mt-[50px] mobile-xs:mt-[100px] mobile:mt-[150px] px-4"
      >
        <div className="flex justify-center items-center relative w-full max-w-[1400px]">
          <input
            type="search"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Введите ингредиенты"
            className="flex items-center bg-[#DABF94]/25 backdrop-blur-3xl backdrop-opacity-10 backdrop-invert rounded-[30px] py-6 px-7 w-full sm:max-w-[700px] md:max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] text-[15px] mobile:text-[20px] text-[#F9F1E6] font-['ArsenalR'] outline-none focus:ring-2 focus:ring-[#DABF94] placeholder-white placeholder-opacity-[60%] pr-12 sm:pr-16"
          />
          <img
            src="/search.png"
            alt="Поиск"
            className="absolute right-6 sm:right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 mobile:w-6 mobile:h-6"
          />
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4 text-red-500 text-center font-['ArsenalR']">
          {errorMessage}
        </div>
      )}

      {recipe && (
        <div className="mt-10 bg-[#DABF94] rounded-xl shadow-md p-5 max-w-[800px] z-10 text-black">
          <h3 className="text-lg font-bold">Рецепт:</h3>
          <p className="whitespace-pre-wrap">{recipe}</p>
          <button
            onClick={handleGenerateNew}
            className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Сгенерировать новый рецепт
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAi;
