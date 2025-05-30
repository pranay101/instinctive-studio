"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import { Attribute, Category, Listing, Pagination } from "@/config/definitions";
import { formatCapitalize, isValidString } from "@/utils";
import { cn } from "@/utils/cn";
import {
  ListBulletIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FilterPanel,
  Header,
  HeroBanner,
  ListingCard,
  Skelaton,
} from "../components";

const SORT_OPTIONS = [
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Oldest",
];

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50] as const;
type ItemsPerPage = (typeof ITEMS_PER_PAGE_OPTIONS)[number];

const ITEMS_PER_PAGE = 9;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 0,
    offset: 0,
  });
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
      const category = searchParams.get("category");
      if (!category) return;
      try {
        setLoadingFilters(true);
        const response = await fetch(
          `/api/categories/attributes?category=${category.toLowerCase()}`
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: {
          attributes: Attribute[];
          category: { name: string; slug: string };
        } = await response.json();
        setAttributes(data.attributes);
      } catch (error) {
        setAttributes([]);
        setLoadingFilters(false);
        console.error("Error fetching categories:", error);
        toast.error("Failed to load category attributes");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchAttributes();
  }, [searchParams.get("category")]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: {
          categories: Category[];
        } = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (
        !isValidString(searchParams.get("q")) &&
        !isValidString(searchParams.get("category"))
      ) {
        return;
      }
      setLoading(true);
      try {
        const filters = Object.fromEntries(
          Array.from(searchParams.entries()).filter(
            ([key]) => !["q", "category", "offset"].includes(key)
          )
        );

        const offset = searchParams.get("offset")
          ? Number(searchParams.get("offset"))
          : 0;

        const params = new URLSearchParams({
          q: searchParams.get("q") || "",
          category: searchParams.get("category") || "",
          filters: JSON.stringify(filters),
        });
        const response = await fetch(
          `/api/search?${params}&offset=${offset}&limit=${ITEMS_PER_PAGE}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();

        const category = searchParams.get("category");

        if ((!category || searchParams.get("q")) && results.length > 0) {
          const _categoryId = isValidString(data?.listings?.[0]?.categoryId)
            ? data?.listings?.[0]?.categoryId
            : data?.listings?.[0]?.categoryId.$oid;
          const _categoryName = categories.find(
            (c) => c.id === _categoryId
          )?.slug;
          if (_categoryName) {
            router.push(
              `/?q=${searchParams.get("q")}&category=${_categoryName}`
            );
          }
        }
        setResults(data.listings);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
        setPagination({ total: 0, limit: 0, offset: 0 });
        toast.error("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const isInitialLoad = useMemo(() => {
    return (
      !isValidString(searchParams.get("q")) &&
      !isValidString(searchParams.get("category"))
    );
  }, [searchParams]);

  const handlePageChange = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", newOffset.toString());
    router.push(`/?${params.toString()}`);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="w-full relative flex flex-col gap-6">
      <Header
        categories={categories.map((c) => ({
          label: c.name,
          value: c.slug,
        }))}
      />

      <HeroBanner />

      {/* main section */}
      <section className={cn("grid grid-cols-1 md:grid-cols-4 gap-10")}>
        <aside className="col-span-1 sticky top-28 h-fit pb-10">
          <>
            {results.length > 0 && (
              <BreadCrumbs
                breadCrumbs={[
                  { label: "Home", href: "/" },
                  {
                    label: formatCapitalize(searchParams.get("category") || ""),
                    href: `/?category=${searchParams.get("category")}`,
                  },
                ]}
              />
            )}
            {searchParams.get("category") && (
              <h5 className="text-lg font-bold mb-4">
                {pagination.total} results found for{" "}
                {formatCapitalize(searchParams.get("category") || "")}
              </h5>
            )}
            <FilterPanel
              isLoading={loadingFilters || loading}
              attributes={attributes || []}
            />
          </>
        </aside>

        <main className="col-span-3 pb-10">
          {results.length > 0 && totalPages > 1 && (
            <div className="text-lg font-medium text-gray-600 mb-6">
              Showing {pagination.offset + 1} to{" "}
              {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
              of {pagination.total} items
            </div>
          )}

          {results.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 w-fit px-2">
                  <ListBulletIcon className="w-6 h-6" />
                  <Squares2X2Icon className="w-6 h-6 bg-gray-200 rounded-sm p-1" />
                </div>
              </div>
              <select
                disabled
                defaultValue="Relevance"
                className="select select-bordered border disabled:border-gray-200 rounded-md w-48"
              >
                {SORT_OPTIONS.map((option, index) => (
                  <option key={`${option}-${index}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            )}
          >
            {loading ? (
              Array.from({ length: pagination.limit })
                .fill(0)
                .map((_, index) => <Skelaton key={`skeleton-${index}`} />)
            ) : results?.length === 0 ? (
              isInitialLoad ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Browse our collection of shoes and TVs
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Use the search bar or filters to find exactly what you're
                    looking for.
                  </p>
                </div>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <NoSymbolIcon className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No results found
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )
            ) : (
              results?.map((listing) => (
                <ListingCard key={listing._id.$oid} listing={listing} />
              ))
            )}
          </div>

          {/* Pagination */}
          {results.length > 0 && totalPages > 1 && (
            <div className="flex join gap-2 mt-10 justify-center">
              {getVisiblePages().map((page, index) =>
                page === "..." ? (
                  <button
                    key={`ellipsis-${index}`}
                    className="bg-gray-100 p-2"
                    disabled
                  >
                    ...
                  </button>
                ) : (
                  <button
                    key={page}
                    className={`bg-gray-100 py-2 px-4 rounded-md border border-gray-200 cursor-pointer ${
                      currentPage === page ? "bg-teal-50 border-teal-400" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange((Number(page) - 1) * pagination.limit);
                    }}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
