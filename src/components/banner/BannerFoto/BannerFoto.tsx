import Image from "next/image";
import React from "react";

const BannerFoto = () => {
  return (
    <Image
      className="hidden tablet:block"
      src="/fon2.png"
      alt="fon image"
      width={600}
      height={557}
      priority
    />
  );
};

export default BannerFoto;
