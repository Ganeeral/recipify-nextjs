import React from "react";
import SearchAi from "@/components/search/SearchAi/SearchAi.tsx";

const SearchText = () => {
    return (
        // <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full ">
                <h1 className="text-8xl font-['ArsenalR'] clamp-banner__down tracking-widest text-[#DABF94] text-nowrap">Попробуй <span className="clamp-banner__up">Д</span>ЕЛИКО!</h1>{/* "деликатес" */}
                <SearchAi />
            </div>
        // </div>
    );
}

export default SearchText 
