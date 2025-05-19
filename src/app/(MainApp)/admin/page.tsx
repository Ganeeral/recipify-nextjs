import Image from "next/image";
import Admin from "@/components/admin/Admin.tsx";

export default function Home() {
  return (
    <div className="container">
      <main className="flex flex-col justify-center items-center">
        <Admin />
      </main>
    </div>
  );
}
