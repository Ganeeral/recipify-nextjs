"use client";
import "@/app/globals.css";
import Image from "next/image";
import cn from "classnames";
import { useState } from "react";
import Link from "next/link";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    setIsOpen(false); // Закрываем меню после выхода
  };

  const handleNavigationClick = () => {
    setIsOpen(false); // Закрываем меню при переходе по ссылке
  };

  return (
    <div id="page" className="relative">
      {/* <Image
        className="absolute top-0"
        src="/fon.png"
        alt="fon image"
        width={800}
        height={757}
        priority
      /> */}

      <button
        className="fixed top-12 right-20 flex flex-col items-center justify-center space-y-1 p-2 z-50 mobile:right-28 focus:border-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={cn(
            "block h-[2px] w-6 bg-[#ECD7BA] rounded-[30px] transition-all duration-300",
            isOpen
              ? "rotate-45 translate-y-[5px] w-7 bg-white"
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
          <Link href="/profile" onClick={handleNavigationClick}>
            <Image src="/profile.png" alt="profile" width={14} height={17} />
          </Link>
          {/* <Image src="/favourites.png" alt="favourites" width={18} height={17} /> */}
          <Link href="/" onClick={handleNavigationClick}>
            <Image src="/home.png" alt="home" width={18} height={17} />
          </Link>

          <Image
            onClick={handleLogout}
            className="cursor-pointer"
            src="/exit.png"
            alt="exit"
            width={19}
            height={19}
          />

          {/* <Image src="/users.png" alt="users" width={21} height={14} /> */}
        </div>
      )}

      {children}
    </div>
  );
}
