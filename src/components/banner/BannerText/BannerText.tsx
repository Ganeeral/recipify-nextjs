import React from "react";

const BannerText = () => {
  return (
    <div className="flex mobile:mt-48 p-2">
      <div className="flex flex-col justify-end gap-24">
        <div className="max-h-80 relative">
          <div className="absolute hidden mobile-xs:block w-1 bg-[#3F1D11] max-h-full h-full rounded-md"></div>
          <div className="mobile-xs:ml-6">
            {/* <h1 className="text-8xl font-['ArsenalR'] clamp-banner__down uppercase tracking-widest text-[#F9F1E6] pt-12">
              <span className="clamp-banner__up">r</span>ecipify
            </h1> */}
            <h1 className="text-8xl font-['ArsenalR'] clamp-banner__down uppercase tracking-widest text-[#F9F1E6] pt-12 pb-4">
              <span className="clamp-banner__up">Д</span>елико {/* "деликатес" */}
            </h1>
            <div className="flex flex-col ml-1 mobile-xs:ml-2 gap-y-8">
              <p className="text-3xl font-['ArsenalB'] text-[#F9F1E6]">
                ГОТОВИТЬ ЛЕГКО
              </p>
              <p className="flex flex-nowrap text-[15px] font-['ArsenalR'] text-[#F9F1E6]">
                готовьте вместе с нашим удобным сервисом!
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-[280px] hidden mobile-xs:block h-1 bg-[#3F1D11] rounded-md"></div>
      </div>
    </div>
  );
}

export default BannerText 
