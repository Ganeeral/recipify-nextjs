"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Auth() {
  const { push } = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData };

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        // Показываем ошибку Toastify
        toast.error(result.message || "Ошибка выполнения запроса");
        return;
      }

      const { token, user } = result;
      const { ID } = user;

      localStorage.setItem("authToken", token);
      localStorage.setItem("id", ID);

      // Успешное действие
      toast.success(
        isLogin ? "Вы успешно вошли в систему" : "Регистрация прошла успешно"
      );
      setTimeout(() => push("/profile"), 2000); // Перенаправление после небольшой задержки
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Произошла ошибка, попробуйте снова");
    }
  };

  return (
    <div className="relative flex justify-center h-screen w-full mt-20 ml-[25%]">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div
        onClick={toggleForm}
        className="flex justify-between items-center gap-6 max-h-[50px] max-w-[155px] w-full mobile-xs:min-w-[155px] bg-black border-black border rounded-[20px] py-[8px] px-[15px] text-[#F9F1E6] text-[12px] font-['ArsenalB'] cursor-pointer z-50 mt-[15px] mr-[-230px] mobile-xs:mr-[-200px] sm:mr-[-160px] md:mr-[-80px]"
      >
        {isLogin ? (
          <>
            <span className="flex">регистрация</span>
            <div className="flex w-[30px]">
              <Image
                src="/arrows.png"
                alt="arrow icon"
                width={30}
                height={30}
                priority
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex w-[30px]">
              <Image
                src="/arrowl.png"
                alt="arrow icon"
                width={30}
                height={30}
                priority
              />
            </div>
            <span className="flex">вход</span>
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex flex-col justify-center h-screen w-full blur__banner backdrop-opacity-10 backdrop-invert bg-[#DABF94]/60 rounded-[20px] text-[#F9F1E6] max-w-[310px] mobile-xs:min-w-[425px] sm:min-w-[350px] md:min-w-[480px] max-h-[550px] px-[15px] mobile-xs:px-[50px] pt-8 pb-14 gap-64 transition-transform duration-500 ${isLogin ? " md:-translate-x-[480px]" : ""}`}
      >
        <div className="flex flex-col items-end w-full h-full">
          <div
            className={`flex ${isLogin ? "justify-start" : "justify-end"
              } w-full`}
          >
            <Link href="../">
              <Image
                src="/home_icons.png"
                alt="home icon"
                width={23}
                height={22}
                priority
              />
            </Link>
          </div>

          <div className="flex flex-col w-full mt-[40px] mb-[40px]">
            <h2 className="text-black text-[35px] font-['ArsenalB']">
              {isLogin ? "ВХОД" : "РЕГИСТРАЦИЯ"}
            </h2>
            <p className="text-black text-[12px] font-['ArsenalR']">
              {isLogin
                ? "Мы рады, что Вы возвращаетесь вновь!"
                : "Зарегистрируйтесь в нашей системе для доступа к\nпоиску рецептов!"}
            </p>
          </div>

          <div className="flex flex-col justify-start w-full gap-[25px]">
            {!isLogin && (
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="NAME"
                className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] text-black focus:outline-none"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              onChange={handleChange}
              className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] text-black focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              onChange={handleChange}
              className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] text-black focus:outline-none"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                name="confirmPassword"
                onChange={handleChange}
                className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] text-black focus:outline-none"
              />
            )}
          </div>

          {!isLogin && (
            <div className="flex items-center text-center gap-[5px] w-full mt-[40px] mb-[40px]">
              <input
                type="checkbox"
                className="bg-inherit border-b-black border"
              />
              <a
                href=""
                className="text-black text-[12px] font-['ArsenalB'] underline"
              >
                политика конфиденциальности
              </a>
            </div>
          )}
          {/* {isLogin && (
            <div className="flex items-center justify-end w-full mt-[40px] mb-[40px]">
              <a
                href="#"
                className="text-black text-[12px] font-['ArsenalB'] underline"
              >
                забыли пароль?
              </a>
            </div>
          )} */}

          <div className="flex justify-center items-end w-full h-full">
            <input
              type="submit"
              value={isLogin ? "ВОЙТИ" : "ЗАРЕГИСТРИРОВАТЬСЯ"}
              className="flex justify-end items-end bg-black border-black border rounded-[20px] py-[8px] px-[45px] min-w-[272px] text-[#F9F1E6] text-[18px] font-['ArsenalB'] cursor-pointer hover:transition-[15s] hover:bg-[#131313]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
