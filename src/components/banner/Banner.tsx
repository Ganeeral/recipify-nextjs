import BannerText from "@/components/banner/BannerText/BannerText.tsx";
import BannerFoto from "@/components/banner/BannerFoto/BannerFoto.tsx";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="flex px-9 py-5 w-full z-10">
      <Image
        className="absolute inset-0"
        src="/fon.png"
        alt="fon image"
        width={800}
        height={757}
        priority
      />
      <div className="flex justify-center items-center top-0 blur__banner backdrop-opacity-10 backdrop-invert bg-[#DABF94]/35 rounded-[20px] text-[#F9F1E6] w-full h-screen max-h-[450px] mobile:max-h-[620px] mobile:justify-between mobile:pl-[90px]">
        <BannerText />
        <BannerFoto />
      </div>
    </div>
  );
}
