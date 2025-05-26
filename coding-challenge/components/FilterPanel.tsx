import { Attribute } from "@/config/definitions";
import { cn } from "@/utils/cn";
import {
  BuildingStorefrontIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

interface FilterPanelProps {
  attributes: Attribute[];
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  attributes,
  isLoading,
}) => {
  const router = useRouter();
  const queryParams = useSearchParams();

  const brands = useMemo(() => {
    return attributes.find((attribute) => attribute.name === "brand")?.values;
  }, [attributes]);

  const onChange = (name: string, value: string) => {
    const searchParams = new URLSearchParams(queryParams.toString());
    if (queryParams.get(name) === value) {
      searchParams.delete(name);
    } else {
      searchParams.delete("q");
      searchParams.set(name, value);
    }
    router.push(`?${searchParams.toString()}`);
  };

  const otherAttributes = useMemo(() => {
    return attributes.filter(
      (attribute) =>
        attribute.name !== "brand" && attribute.name !== "price_range"
    );
  }, [attributes]);

  if (isLoading) {
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }

const clearFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const searchParams = new URLSearchParams();
  router.push(`?${searchParams.toString()}`);
};

  return (
    <div className="space-y-6">
      {attributes?.length > 0 && <button
        className="btn btn-link my-0 ml-0 text-red-600"
        onClick={clearFilters}
      >
        Clear Filters
      </button>}
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
                onClick={(e) => {
                  e.preventDefault();
                  onChange(attribute.name, value);
                }}
                className={cn(
                  "text-sm py-1 px-2 border border-gray-200 rounded-lg cursor-pointer hover:border-teal-400",
                  queryParams.get(attribute.name) === value &&
                    "border-teal-400 bg-teal-50"
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
