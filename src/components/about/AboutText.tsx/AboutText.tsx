import React from "react";

const AboutText = () => {
    return (
        <div className="flex flex-col justify-center items-center absolute px-9">
            <div className="max-h-80">
                <div className="absolute hidden -left-6 tablet:block w-1 top-1/2 bg-[#DABF94] max-h-full h-full rounded-md"></div>
                <div className="flex flex-col justify-center items-center w-full gap-24 max-w-[900px] tablet:max-w-[1000px]">
                    <h1 className="text-6xl font-['ArsenalB'] tracking-widest text-[#DABF94] clamp-banner__down">Добро пожаловать!</h1>
                    <p className="flex text-2xl mobile-xs:text-4xl font-['ArsenalB'] w-full h-full text-[#DABF94] justify-center text-justify text-balance">«Recipify» — это интуитивно понятное и удобное веб-приложение, которое помогает Вам находить вкусные и полезные рецепты на основе ингредиентов, которые у Вас уже есть. С помощью технологии искусственного интеллекта приложение анализирует введённые пользователем продукты и предлагает разнообразные варианты блюд, учитывая Ваши предпочтения и ограничения.</p>
                </div>
                <div className="max-w-[280px] hidden mt-32 tablet:block h-1 bg-[#DABF94] rounded-md"></div>
            </div>
        </div>
    );
}

export default AboutText 
