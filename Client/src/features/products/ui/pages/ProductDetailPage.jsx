import { Link, useParams } from "react-router";
import { ArrowLeft, PackageOpen } from "lucide-react";
import useProduct from "@/features/products/hook/useProduct";
import useDocumentTitle from "@/shared/hook/useDocumentTitle";
import normalizeApiError from "@/shared/utils/normalizeApiError";
import formatPrice from "@/shared/utils/formatPrice";
import ProductGallery from "@/features/products/ui/components/ProductGallery";
import SizeList from "@/features/products/ui/components/SizeList";
import Skeleton from "@/shared/ui/components/Skeleton";
import ErrorState from "@/shared/ui/components/ErrorState";
import EmptyState from "@/shared/ui/components/EmptyState";
import Button from "@/shared/ui/components/Button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  useDocumentTitle(product?.title || "Product");

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-5 w-32" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 w-14" />
              <Skeleton className="h-10 w-14" />
              <Skeleton className="h-10 w-14" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const normalized = normalizeApiError(error);

    if (normalized.status === 400 || normalized.status === 404) {
      return (
        <EmptyState
          icon={PackageOpen}
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={
            <Link to="/">
              <Button variant="secondary">Back to products</Button>
            </Link>
          }
        />
      );
    }

    return <ErrorState message={normalized.message} onRetry={refetch} />;
  }

  if (!product) return null;

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} />

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {product.title}
          </h1>
          <p className="mt-2 text-xl font-semibold text-neutral-700">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {product.discription}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-medium text-neutral-900">
                Available sizes
              </h2>
              <SizeList sizes={product.sizes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
