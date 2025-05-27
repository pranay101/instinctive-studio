import Image from "next/image";
import React from "react";

interface HeroBannerProps {}

const HeroBanner: React.FC<HeroBannerProps> = () => {
  return (
    <div className="w-full h-[320px] relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute top-1/2 -translate-y-1/2 left-10 z-20 max-w-xl">
        <h2 className="text-white text-5xl font-bold mb-4">
          Elevate Your Style
        </h2>
        <p className="text-white text-xl mb-6">
          Discover the latest trends in fashion. From casual elegance to
          statement pieces, find your perfect look.
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
          Shop Now
        </button>
      </div>
      <Image
        fill
        src="https://images.unsplash.com/photo-1674302556189-a311b4ae2eda?q=80&w=1440&fit=crop"
        alt="Fashion collection hero image"
        className="object-cover h-full w-full"
        priority
      />
    </div>
  );
};

export default HeroBanner;
