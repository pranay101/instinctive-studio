"use client";

import { Attribute, Category, Listing } from "@/config/definitions";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterPanel, Header, ListingCard } from "../components";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Listing[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
      const category = searchParams.get("category");
      if (!category) return;
      try {
        const response = await fetch(
          `/api/categories/attributes?category=${category}`
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: {
          attributes: Attribute[];
          category: { name: string; slug: string };
        } = await response.json();
        setAttributes(data.attributes);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const filters = searchParams.get("filters") || "";

        const params = new URLSearchParams({
          q: searchParams.get("q") || "",
          category: searchParams.get("category") || "",
          filters: JSON.stringify(filters),
        });
        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();

        const category = searchParams.get("category");
        if (!category) {
          const _categoryId = data?.listings?.[0]?.categoryId;
          router.push(`/?category=${_categoryId}`);
        }
        setResults(data.listings);
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  return (
    <div className="w-full relative flex flex-col gap-6">
      <Header
        categories={categories.map((c) => ({
          label: c.name,
          value: c.slug,
        }))}
      />

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
      <section className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="col-span-1 sticky top-28 h-fit">
          <FilterPanel attributes={attributes || []} />
        </aside>
        <main className="col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 w-fit px-2">
              <ListBulletIcon className="w-6 h-6" />
              <Squares2X2Icon className="w-6 h-6 bg-gray-200 rounded-sm p-1" />
            </div>
            <select
              disabled
              defaultValue="Relevance"
              className="select select-bordered border disabled:border-gray-200 rounded-md w-48"
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {loading
              ? Array.from({ length: 9 })
                  .fill(0)
                  .map((s, index) => (
                    <div
                      key={`${s}-${index}`}
                      className="flex max-w-[312px] h-[400px] flex-col gap-4 bg-white border border-gray-200 rounded-lg w-full p-6 animate-pulse"
                    >
                      <div className="skeleton h-32 w-full bg-gray-100"></div>
                      <div className="skeleton h-4 w-28 bg-gray-100"></div>
                      <div className="skeleton h-4 w-full bg-gray-100"></div>
                      <div className="skeleton h-4 w-full bg-gray-100"></div>
                      <div className="skeleton h-4 w-full bg-gray-100"></div>
                      <div className="skeleton h-4 w-full bg-gray-100"></div>
                    </div>
                  ))
              : results?.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
          </div>
        </main>
      </section>
    </div>
  );
}
