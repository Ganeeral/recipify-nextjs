"use client";

import Image from "next/image";
import AvtoReg from "@/components/auth/auth";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Проверяем токен только на клиенте
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      router.push("/profile");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Или ваш лоадер
  }

  return (
    <div className="container">
      <main className="flex flex-col justify-center items-center">
        <Image
          className="left-80 absolute top-0 pt-11 hide-image"
          src="/fon.png"
          alt="fon image"
          width={600}
          height={557}
          priority
        />
        <AvtoReg />
      </main>
    </div>
  );
}