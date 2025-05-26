import {
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface HeaderProps {
  categories: { label: string; value: string }[];
}

export default function Header({ categories }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("q", searchValue);
      router.push(`/?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, router]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("category", value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="flex justify-start items-center w-full flex-1 gap-6 p-4 sticky top-0 bg-white z-40 inset-0 shadow-sm">
      <h4 className="text-2xl font-bold text-teal-500">Shoes and TVs</h4>
      <div className="flex-1 flex items-center gap-2 px-2 input-bordered border border-gray-200 rounded-lg w-full">
        <MagnifyingGlassIcon className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search listings..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="input flex-1"
        />
      </div>
      <select 
        className="select select-neutral w-36 border border-gray-200 rounded-lg"
        value={searchParams.get("category") || ""}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option disabled value="">
          {categories.length > 0 ? "Select a category" : "No categories found"}
        </option>
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <button className="">
        <ShoppingCartIcon className="w-6 h-6" />
      </button>
      <button className="">
        <HeartIcon className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2 border border-gray-200 rounded-full py-2 px-4">
        <div className="avatar avatar-online">
          <div className="w-8 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
          </div>
        </div>
        <div>
          <h6 className="text-sm font-medium leading-none">Pranay Prajapati</h6>
          <a className="text-xs text-gray-500">View Profile</a>
        </div>
      </div>
    </header>
  );
}
