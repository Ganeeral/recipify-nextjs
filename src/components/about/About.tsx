import Image from "next/image";
import AboutText from "@/components/about/AboutText.tsx/AboutText.tsx";

export default function About() {
    return (
        // <div className="flex justify-center items-center h-full w-full ">
        <div className="flex justify-center items-center w-full h-screen z-10">
            <AboutText />
            {/* </div> */}
        </div>
    );
}
