// файл: components/ProfileUser.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface UserData {
//   id: number;
//   name: string;
//   email: string;
// }

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileUser: React.FC = () => {
  // const [user, setUser] = useState<UserData>({ id: 0, name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<string>("");

  const userId = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `https://delico-backend.cloudpub.ru/users/${userId}`
        );
        if (!response.ok) throw new Error("Ошибка при загрузке пользователя");
        const data = await response.json();
        // setUser(data);
        setFormData({ name: data.Name || "", email: data.Email || "" });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://delico-backend.cloudpub.ru/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name: formData.name, Email: formData.email }),
        }
      );
      if (!response.ok)
        throw new Error("Ошибка при обновлении данных пользователя");
      // const updatedUser = await response.json();
      // setUser(updatedUser);
      // Можно уведомить пользователя, что данные обновлены
    } catch (error) {
      console.error(error);
    }
  };

  // Открыть/закрыть модалку смены пароля
  const openPasswordModal = () => {
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors("");
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  // Обработка изменения полей пароля
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordErrors("");
  };

  // Сабмит формы смены пароля
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Базовая валидация: не менее 6 символов
    if (
      passwordForm.oldPassword.trim().length < 6 ||
      passwordForm.newPassword.trim().length < 6
    ) {
      setPasswordErrors("Пароли должны быть минимум 6 символов");
      return;
    }
    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setPasswordErrors("Новый пароль должен отличаться от старого");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch(
        `https://delico-backend.cloudpub.ru/users/${userId}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_password: passwordForm.oldPassword,
            new_password: passwordForm.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setPasswordErrors(data.error || "Ошибка при смене пароля");
      } else {
        // Успешно
        toast.success("Пароль успешно изменен");
        closePasswordModal();
        // Можно показать уведомление о том, что пароль успешно изменён
      }
    } catch (error) {
      console.error(error);
      setPasswordErrors("Сетевая ошибка при смене пароля");
    }
  };

  return (
    <div className="flex flex-col h-full relative justify-between sm:min-w-[300px]">
      <div className="flex flex-col h-full justify-between items-center">
        <div className="flex flex-col justify-center items-center mt-[40px] ">
          <h2 className="text-black text-xs text-2xs text-2sm sm:text-[40px] font-['ArsenalB']">
            Личный кабинет
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center text-[#F9F1E6] max-w-[220px] max-h-[300px] gap-[25px] h-full w-full pt-10"
          >
            <input
              type="text"
              name="name"
              placeholder="NAME"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] min-w-[220px] text-black focus:border-none"
            />
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="bg-inherit border-b-black border border-x-0 border-t-0 placeholder-black font-['ArsenalR'] min-w-[220px] text-black focus:border-none"
            />
            <input
              type="submit"
              value="РЕДАКТИРОВАТЬ"
              className="flex justify-center w-full bg-black border-black border rounded-[20px] max-w-[180px] mt-11 py-[5px] px-[30px] text-[#F9F1E6] text-[15px] font-['ArsenalB'] cursor-pointer hover:transition-[15s] hover:bg-[#131313]"
            />
          </form>
          {/* Кнопка смены пароля */}
          <button
            onClick={openPasswordModal}
            className="mt-2 text-black text-sm underline font-['ArsenalR'] hover:opacity-80"
          >
            Сменить пароль
          </button>
        </div>
        <p className="text-black text-[14px] font-['ArsenalB'] py-3 md:py-0">
          {new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="w-full md:w-[300px] h-1 bg-[#3F1D11] rounded-md mb-[-15px]"></div>

      {/* Модальное окно смены пароля */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#dabf94] p-6 rounded-lg shadow-lg relative w-full max-w-[400px]">
            <button
              onClick={closePasswordModal}
              className="text-gray-500 hover:text-gray-700 absolute right-4"
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
            <h3 className="flex justify-center text-xl text-black font-bold mb-4">
              Сменить пароль
            </h3>

            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col">
                <label className="text-black font-['ArsenalR'] mb-1">
                  Старый пароль
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="border border-[#3F1D11] px-2 py-1 outline-none rounded text-[#3F1D11] bg-[#ffffff]"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-black font-['ArsenalR'] mb-1">
                  Новый пароль
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="border border-[#3F1D11] px-2 py-1 outline-none rounded text-[#3F1D11] bg-[#ffffff]"
                  required
                  minLength={6}
                />
                <label className="text-black font-['ArsenalR'] mb-1">
                  Повторите пароль
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="border border-[#3F1D11] px-2 py-1 outline-none rounded text-[#3F1D11] bg-[#ffffff]"
                  required
                  minLength={6}
                />
              </div>
              {passwordErrors && (
                <p className="text-red-500 text-sm">{passwordErrors}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3F1D11] text-white rounded hover:opacity-90"
                >
                  Сменить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default ProfileUser;
