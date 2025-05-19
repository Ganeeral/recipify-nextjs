'use client';

import Image from "next/image";
import AvtoReg from "@/components/auth/auth";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (token) {
      push("/profile");
    }
  }, []);
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
