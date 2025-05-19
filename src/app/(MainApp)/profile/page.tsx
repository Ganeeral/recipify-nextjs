"use client";

import Profile from "@/components/profile/Profile.tsx";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function Home() {
  // const { push } = useRouter();
  // const token = localStorage.getItem("authToken");

  // useEffect(() => {
  //   if (!token) {
  //     push("/auth");
  //   }
  // }, []);
  return (
    <div className="container">
      <main className="flex flex-col justify-center items-center">
        <Profile />
      </main>
    </div>
  );
}
