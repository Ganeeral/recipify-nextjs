"use client";

import Profile from "@/components/profile/Profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientHome() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="container">
      <section className="flex flex-col justify-center items-center h-full">
        <Profile />
      </section>
    </div>
  );
}