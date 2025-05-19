// import Image from "next/image";
import SearchText from "@/components/search/SearchText/SearchText.tsx";

export default function Search() {
    return (
        <div className="flex justify-center items-center h-screen w-full mx-8 mb-[50px] lg:mb-[80px] xl:mb-[100px] mt-[50px] lg:mt-[80px] xl:mt-[100px]">
            <div className="flex justify-center items-center w-full h-full max-h-[400px] md:max-h-[500px] lg:max-h-[580px] xl:max-h-[620px] z-10">
                <SearchText />
            </div>
        </div>
    );
}

// relative top-[-320px] mobile-xs:top-[-200px] md:top-[-200px] lg:top-[-100px] xl:top-[-50px]