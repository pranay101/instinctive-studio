import { Listing } from "@/config";
import {
  MapPinIcon,
  HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(Math.random() > 0.5);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="w-full max-w-[360px] relative">
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        width={500}
        height={500}
        className="w-full h-[400px] object-cover rounded-lg"
      />
      <button
        className="cursor-pointer absolute top-4 right-4 bg-white p-2 rounded-full z-10"
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <HeartSolidIcon className="w-6 h-6 fill-red-500" />
        ) : (
          <HeartOutlineIcon className="w-6 h-6 stroke-red-500" />
        )}
      </button>

      <div className=" mt-6">
        <h3 className="font-semibold ">{listing.title}</h3>
        <p className="text-gray-500 text-xs">
          {listing.description.slice(0, 100)}...
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="font-medium text-green-700">
          ${listing.price.toFixed(2)}
        </p>
        <p className="text-gray-500 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" /> {listing.location}
        </p>
      </div>

      <ul className="text-xs flex gap-2 items-center flex-wrap text-green-800 mt-4">
        {Object.entries(listing.attributes).map(([key, value]) => (
          <li key={key} className="bg-green-100 py-1 px-3 rounded-full">
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
