'use client';

import Image from "next/image";
import cn from "classnames";
import Banner from "@/components/banner/Banner.tsx";
import About from "@/components/about/About.tsx";
import Search from "@/components/search/Search.tsx";


export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center gap-28">
      <Banner />
      <About />
      <Search />
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src="/grid.png"
          alt=""
          layout="fill"
          priority
        />
      </div>
    </section>
  );
}
