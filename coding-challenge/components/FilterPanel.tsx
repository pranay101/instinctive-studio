import React, { useMemo } from "react";
import { Attribute } from "@/config/definitions";
import { cn } from "@/utils/cn";
import { BuildingStorefrontIcon, CheckIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterPanelProps {
  attributes: Attribute[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ attributes }) => {
  const router = useRouter();
  const queryParams = useSearchParams();

  const brands = useMemo(() => {
    return attributes.find((attribute) => attribute.name === "brand")?.values;
  }, [attributes]);

  const priceRange = useMemo(() => {
    const defaultRange = ["1", "20000"];
    return attributes.find((attribute) => attribute.name === "price_range")?.values || defaultRange;
  }, [attributes]);

  const onChange = (name: string, value: string) => {
    const searchParams = new URLSearchParams(queryParams.toString());
    searchParams.set(name, value);
    router.push(`?${searchParams.toString()}`);
  };

  const otherAttributes = useMemo(() => {
    return attributes.filter((attribute) => 
      attribute.name !== "brand" && attribute.name !== "price_range"
    );
  }, [attributes]);

  return (
    <div className="space-y-6">
      {brands && (
        <div className="h-64 filter-panel-shadow p-4 rounded-sm flex flex-col gap-2">
          <span className="text-sm capitalize shrink-0 pb-2 border-gray-200 border-b">
            Brands
          </span>
          <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {brands.map((brand) => (
              <li
                role="button"
                key={brand}
                onClick={() => onChange("brand", brand)}
                className={cn(
                  "flex items-center justify-between gap-2 p-2 rounded-sm text-sm hover:bg-gray-50",
                  queryParams.get("brand") === brand && "bg-gray-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-6 h-6" color="gray" />
                  {brand}
                </div>
                {queryParams.get("brand") === brand && (
                  <CheckIcon className="w-4 h-4" color="green" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

     
        <div className="filter-panel-shadow p-4 rounded-sm">
          <span className="text-sm capitalize flex items-center gap-2 pb-2 border-gray-200 border-b">
            <CurrencyDollarIcon className="w-5 h-5" color="gray" />
            Price Range
          </span>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              placeholder="Min"
              className="w-24 text-sm py-1 px-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-400 flex-1"
              onChange={(e) => onChange("price_range_min", e.target.value)}
              value={queryParams.get("price_range_min") || ""}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              placeholder="Max"
              className="w-24 text-sm py-1 px-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-400 flex-1"
              onChange={(e) => onChange("price_range_max", e.target.value)}
              value={queryParams.get("price_range_max") || ""}
            />
          </div>
        </div>
    

      {otherAttributes?.map((attribute) => (
        <div
          key={attribute.name}
          className="filter-panel-shadow p-4 rounded-sm"
        >
          <span className="text-sm capitalize">{attribute.name}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {attribute.values.map((value) => (
              <button
                key={value}
                onClick={() => onChange(attribute.name, value)}
                className={cn(
                  "text-sm py-1 px-2 border border-gray-200 rounded-lg cursor-pointer hover:border-teal-400",
                  queryParams.get(attribute.name) === value && "border-teal-400 bg-teal-50"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
