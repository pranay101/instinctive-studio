import {
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  value: string;
  onChange: (value: string) => void;
  categories: { label: string; value: string }[];
  onCategoryChange: (value: string) => void;
}

export default function Header({
  value,
  onChange,
  categories,
  onCategoryChange,
}: HeaderProps) {
  return (
    <header className="flex justify-start items-center w-full flex-1 gap-6 p-4 sticky top-0 bg-white z-40 inset-0 shadow-sm">
      <h4 className="text-2xl font-bold text-teal-500">Shoes and TVs</h4>
      <div className="flex-1 flex items-center gap-2 px-2 input-bordered border border-gray-200 rounded-lg w-full">
        <MagnifyingGlassIcon className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search listings..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input flex-1"
        />
      </div>
      <select 
        className="select select-neutral w-36 border border-gray-200 rounded-lg"
        value={categories.length > 0 ? "" : "no-categories"}
        onChange={(e) => onCategoryChange(e.target.value)}
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
