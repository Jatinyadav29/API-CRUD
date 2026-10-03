import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useProductFilters from "@/features/products/hook/useProductFilters";
import useDebounce from "@/shared/hook/useDebounce";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title-asc", label: "Name: A–Z" },
];

export default function ProductFilters() {
  const { search, sort, setSearch, setSort } = useProductFilters();
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

  if (search === "" && localSearch !== "" && debouncedSearch !== "") {
    setLocalSearch("");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm text-neutral-500">
          Sort by
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
