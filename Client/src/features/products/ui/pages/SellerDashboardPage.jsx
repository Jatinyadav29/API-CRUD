import { useState } from "react";
import { Link } from "react-router";
import { PackageOpen } from "lucide-react";
import useProducts from "@/features/products/hook/useProducts";
import useDeleteProduct from "@/features/products/hook/useDeleteProduct";
import useDocumentTitle from "@/shared/hook/useDocumentTitle";
import normalizeApiError from "@/shared/utils/normalizeApiError";
import SellerStats from "@/features/products/ui/components/SellerStats";
import SellerProductItem from "@/features/products/ui/components/SellerProductItem";
import ConfirmDialog from "@/shared/ui/components/ConfirmDialog";
import ErrorState from "@/shared/ui/components/ErrorState";
import EmptyState from "@/shared/ui/components/EmptyState";
import Button from "@/shared/ui/components/Button";
import Skeleton from "@/shared/ui/components/Skeleton";

export default function SellerDashboardPage() {
  useDocumentTitle("Dashboard");

  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const deleteMutation = useDeleteProduct();
  const [deleteTarget, setDeleteTarget] = useState(null);

  function handleDeleteClick(product) {
    setDeleteTarget(product);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSettled: () => setDeleteTarget(null),
    });
  }

  function handleDeleteCancel() {
    if (!deleteMutation.isPending) setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
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
      <div>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">
          Your products
        </h1>
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          description="Start by adding your first product."
          action={
            <Link to="/seller/products/new">
              <Button>Add product</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Your products</h1>
        <Link to="/seller/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <div className="mb-6">
        <SellerStats products={products} />
      </div>

      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
            <th className="pb-2 pr-4">Product</th>
            <th className="pb-2 pr-4">Price</th>
            <th className="pb-2 pr-4">Stock</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <SellerProductItem
              key={product._id}
              product={product}
              onDelete={handleDeleteClick}
              deleteDisabled={deleteMutation.isPending}
            />
          ))}
        </tbody>
      </table>

      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <SellerProductItem
            key={product._id}
            product={product}
            onDelete={handleDeleteClick}
            deleteDisabled={deleteMutation.isPending}
          />
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete "${deleteTarget.title}"?` : ""}
        description="This also removes its images and cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
