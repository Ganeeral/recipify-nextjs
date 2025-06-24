// import Image from "next/image";
import SearchText from "@/components/search/SearchText/SearchText.tsx";

export default function Search() {
    return (
        <div className="flex justify-center items-center w-full mx-8 mb-52">
            <div className="flex justify-center items-center w-full h-full  ">
                <SearchText />
            </div>
        </div>
    );
}

// relative top-[-320px] mobile-xs:top-[-200px] md:top-[-200px] lg:top-[-100px] xl:top-[-50px]