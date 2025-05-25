"use client";

import { useState, useEffect } from "react";
import { Header } from "../components";
import FilterPanel from "../components/FilterPanel";
import ListingCard from "../components/ListingCard";

type GeneralObject = {
  [key: string]: any;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState<GeneralObject>({});
  const [results, setResults] = useState<GeneralObject[]>([]);
  const [facets, setFacets] = useState<GeneralObject>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          category,
          filters: JSON.stringify(filters),
        });
        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setResults(data.listings);
        setFacets(data.facets);
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
        setFacets({});
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, filters]);

  return (
    <div className="w-full">
      <Header value={query} onChange={setQuery} />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">B2B Marketplace Search</h1>
        {/* <FilterPanel facets={facets} onFilterChange={setFilters} /> */}
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {results?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
