import { Listing } from "@/config";
import { MapPinIcon, HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(Math.random() > 0.5);
  const [showToast, setShowToast] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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

      <div className="flex justify-between items-center mt-6">
        <h3 className="font-semibold ">{listing.title}</h3>

        <button className="cursor-pointer" onClick={handleFavoriteClick}>
          {isFavorite ? (
            <HeartSolidIcon className="w-6 h-6 fill-red-500" />
          ) : (
            <HeartOutlineIcon className="w-6 h-6 stroke-red-500" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="font-medium text-green-700">
          ${listing.price.toFixed(2)}
        </p>
        <p className="text-gray-500 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" /> {listing.location}
        </p>
      </div>

      {showToast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success">
            <span>{isFavorite ? 'Added to favorites' : 'Removed from favorites'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
