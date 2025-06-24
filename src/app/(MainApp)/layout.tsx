"use client";
import "@/app/globals.css";
import Image from "next/image";
import cn from "classnames";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [userID, setUserID] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setUserID(Number(storedId));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    setUserID(null); // Сбрасываем userID при выходе
    setIsOpen(false); // Закрываем меню после выхода
  };

  const handleNavigationClick = () => {
    setIsOpen(false); // Закрываем меню при переходе по ссылке
  };

  return (
    <div id="page" className="relative h-full">
      <button
        className="fixed top-12 right-20 flex flex-col items-center justify-center space-y-1 p-2 z-50 mobile:right-28 focus:border-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={cn(
            "block h-[2px] w-6 bg-[#ECD7BA] rounded-[30px] transition-all duration-300",
            isOpen
              ? "rotate-45 translate-y-[7px] w-7 bg-white"
              : "animate-burgerPulse1"
          )}
        />
        <span
          className={cn(
            "block h-[2px] w-6 bg-[#ECD7BA] rounded-[30px] transition-all duration-300",
            isOpen ? "opacity-0" : "animate-burgerPulse2"
          )}
        />
        <span
          className={cn(
            "block h-[2px] w-6 bg-[#ECD7BA] rounded-[30px] transition-all duration-300",
            isOpen
              ? "-rotate-45 -translate-y-[5px] w-7 bg-white"
              : "animate-burgerPulse3"
          )}
        />
      </button>

      {isOpen && (
        <div className="fixed top-10 right-16 flex justify-around items-center space-x-4 bg-[#DABF94]/40 py-3 pl-6 pr-24 rounded-[30px] z-40 mobile:right-24">
          <Link href="/" onClick={handleNavigationClick}>
            <Image src="/home.png" alt="home" width={18} height={17} />
          </Link>
          <Link
            href={userID ? `/profile` : `/auth`}
            onClick={handleNavigationClick}
          >
            <Image src="/profile.png" alt="profile" width={14} height={17} />
          </Link>

          {/* Показываем кнопку выхода только если пользователь авторизован */}
          {userID && (
            <Link href="/" onClick={handleLogout}>
              <Image
                className="cursor-pointer"
                src="/exit.png"
                alt="exit"
                width={19}
                height={19}
              />
            </Link>
          )}
        </div>
      )}

      {children}
    </div>
  );
}