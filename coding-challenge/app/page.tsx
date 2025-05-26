"use client";

import { useState, useEffect } from "react";
import { Header, ListingCard, FilterPanel } from "../components";
import { cn } from "@/utils/cn";
import { Attribute, Category, GeneralObject } from "@/config/definitions";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<GeneralObject>({});
  const [results, setResults] = useState<GeneralObject[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
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
  }, [category]);

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
        const params = new URLSearchParams({
          q: query,
          category: category || "",
          filters: JSON.stringify(filters),
        });
        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        if (!category) {
          const _categoryId = data?.listings?.[0]?.categoryId;
          setCategory(categories.find((c) => c.id === _categoryId)?.slug || "");
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
  }, [query, category, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  console.log(attributes, "attributes");
  console.log(category, "categories");
  return (
    <div className="w-full">
      <Header
        value={query}
        onChange={setQuery}
        categories={categories.map((c) => ({
          label: c.name,
          value: c.slug,
        }))}
        onCategoryChange={setCategory}
      />
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="col-span-1">
          <FilterPanel
            attributes={attributes || []}
            onFilterChange={handleFilterChange}
          />
        </aside>
        <main className="col-span-3">
          <h1 className="text-3xl font-bold mb-6">B2B Marketplace Search</h1>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {results?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
