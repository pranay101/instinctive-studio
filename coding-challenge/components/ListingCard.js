import Image from "next/image";

export default function ListingCard({ listing }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
      <p className="text-gray-600 mb-2">{listing.description}</p>
      <p className="text-lg font-medium text-green-600 mb-2">
        ${listing.price.toFixed(2)}
      </p>
      <p className="text-gray-500 mb-2">📍 {listing.location}</p>
      {/* <p className="text-gray-500 mb-3">Category: {listing.category.name}</p> */}
      <div className="border-t pt-3">
        <h4 className="font-medium mb-2">Specifications:</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(listing.attributes).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="text-gray-500 capitalize">{key}:</span>{" "}
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
