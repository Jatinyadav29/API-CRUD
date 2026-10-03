import { useMemo } from "react";
import { PackageOpen, SearchX } from "lucide-react";
import useProducts from "@/features/products/hook/useProducts";
import useProductFilters from "@/features/products/hook/useProductFilters";
import useDocumentTitle from "@/shared/hook/useDocumentTitle";
import normalizeApiError from "@/shared/utils/normalizeApiError";
import ProductFilters from "@/features/products/ui/components/ProductFilters";
import ProductGrid from "@/features/products/ui/components/ProductGrid";
import ProductCard from "@/features/products/ui/components/ProductCard";
import ProductCardSkeleton from "@/features/products/ui/components/ProductCardSkeleton";
import ErrorState from "@/shared/ui/components/ErrorState";
import EmptyState from "@/shared/ui/components/EmptyState";
import Button from "@/shared/ui/components/Button";

export default function ProductListPage() {
  useDocumentTitle("Products");

  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const { search, sort, resetFilters } = useProductFilters();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products;

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price.amount - b.price.amount);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price.amount - a.price.amount);
    } else if (sort === "title-asc") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    }

    return result;
  }, [products, search, sort]);

  if (isLoading) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        </div>
        <ProductGrid>
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={normalizeApiError(error).message}
        onRetry={refetch}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">Products</h1>
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          description="Check back later for new arrivals."
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <p className="text-sm text-neutral-500">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mb-6">
        <ProductFilters />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No results"
          description="No products match your search."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Clear search
            </Button>
          }
        />
      ) : (
        <ProductGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      )}
    </>
  );
}
