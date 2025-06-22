"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const SearchAi = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      toast.warn("Введите ингредиенты!", { position: "top-center" });
      return;
    }

    const userID = Number(localStorage.getItem("id"));

    if (!userID) {
      toast.error(
        <div>
          Авторизируйтесь перед тем как сгенерировать рецепт! <br />
          <Link
            href={"/auth"}
            className="flex mr-auto justify-end items-end bg-white text-black px-2 py-1 rounded text-sm transition"
          >
            Войти
          </Link>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeButton: false,
        }
      );
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://delico-backend.cloudpub.ru/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients: ingredients, user_id: userID }),
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Серверная ошибка");
        }
        throw new Error("Ошибка при получении рецепта");
      }

      const data = await response.json();
      const cleanedRecipe = data.recipe
        .replace(/\*\*\*|```|plaintext/g, "")
        .trim();

      if (cleanedRecipe.includes("Пожалуйста, введите съедобные ингредиенты")) {
        setRecipe("");
        toast.error("Введите съедобные ингредиенты");
      } else {
        setRecipe(cleanedRecipe);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Не удалось сгенерировать рецепт. Попробуйте еще раз чуть позже."
      );
    } finally {
      setLoading(false);
    }
  };

  // ... остальной код остается без изменений
  const handleGenerateNew = () => {
    setRecipe("");
    handleSearch();
  };

  const handleClearAll = () => {
    setIngredients("");
    setRecipe("");
    setErrorMessage("");
  };

  const animateText = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  };

  const animateLetter = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col items-center my-auto px-6">
      <ToastContainer />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex justify-center items-center font-['ArsenalR'] w-full text-[#DABF94] mt-[50px] md:mt-[80px] lg:mt-[100px] xl:mt-[140px]"
      >
        <div className="flex justify-center items-center relative w-full max-w-[1400px]">
          <input
            type="search"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Введите ингредиенты"
            className="flex items-center bg-[#DABF94]/25 backdrop-blur-3xl backdrop-opacity-10 backdrop-invert rounded-[20px] py-6 px-7 w-full min-w-[300px] mobile-xs:min-w-[400px] mobile:min-w-[500px] sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1200px] text-[15px] mobile:text-[20px] text-[#F9F1E6] font-['ArsenalR'] outline-none focus:ring-2 focus:ring-[#DABF94] placeholder-white placeholder-opacity-[60%] pr-12 sm:pr-16"
          />
          <img
            src="/search.png"
            alt="Поиск"
            className="absolute right-6 sm:right-8 xl:right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 mobile:w-6 mobile:h-6"
          />
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4 text-red-500 text-center font-['ArsenalR']">
          {errorMessage}
        </div>
      )}

      {loading && (
        <motion.div
          className="flex justify-center items-center mt-24 text-5xl font-bold text-[#DABF94] tracking-wide"
          initial="hidden"
          animate="visible"
          variants={animateText}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span variants={animateLetter}>Д</motion.span>
          <motion.span variants={animateLetter}>е</motion.span>
          <motion.span variants={animateLetter}>л</motion.span>
          <motion.span variants={animateLetter}>и</motion.span>
          <motion.span variants={animateLetter}>к</motion.span>
          <motion.span variants={animateLetter}>о</motion.span>
          <motion.span variants={animateLetter}>...</motion.span>
        </motion.div>
      )}

      {recipe && !loading && (
        <motion.div
          className="w-full lg:min-w-[1000px] xl:min-w-[1200px] mx-6 mt-10 bg-[#dabf94d1] mb-[50px] rounded-[20px] shadow-md p-5 max-w-[800px] z-10 text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-bold">Рецепт:</h3>
          <p className="whitespace-pre-wrap">{recipe}</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerateNew}
              className="bg-black text-white px-4 py-2 rounded-[10px] hover:bg-gray-800 transition"
            >
              Сгенерировать новый рецепт
            </button>
            <button
              onClick={handleClearAll}
              className="bg-black text-white px-4 py-2 rounded-[10px] hover:bg-gray-800 transition"
            >
              Очистить всё
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAi;
