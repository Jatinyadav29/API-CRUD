import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PackageOpen } from "lucide-react";
import useProduct from "@/features/products/hook/useProduct";
import useUpdateProduct from "@/features/products/hook/useUpdateProduct";
import useDocumentTitle from "@/shared/hook/useDocumentTitle";
import normalizeApiError from "@/shared/utils/normalizeApiError";
import buildProductFormData from "@/features/products/utils/buildProductFormData";
import applyApiErrors from "@/features/products/utils/applyApiErrors";
import { sortSizes } from "@/features/products/utils/sizes";
import ProductForm from "@/features/products/ui/components/ProductForm";
import Skeleton from "@/shared/ui/components/Skeleton";
import ErrorState from "@/shared/ui/components/ErrorState";
import EmptyState from "@/shared/ui/components/EmptyState";
import Button from "@/shared/ui/components/Button";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  const updateMutation = useUpdateProduct();
  const [banner, setBanner] = useState("");

  useDocumentTitle(product ? `Edit ${product.title}` : "Edit product");

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="aspect-video w-full rounded-xl" />
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
            <Link to="/seller/dashboard">
              <Button variant="secondary">Back to dashboard</Button>
            </Link>
          }
        />
      );
    }

    return <ErrorState message={normalized.message} onRetry={refetch} />;
  }

  if (!product) return null;

  const formDefaults = {
    title: product.title,
    discription: product.discription,
    price: {
      amount: product.price.amount,
      currency: product.price.currency,
    },
    sizes: sortSizes(product.sizes).map((s) => ({
      size: s.size,
      stock: s.stock,
    })),
  };

  function handleSubmit(values, files, onProgress, setError) {
    setBanner("");
    const formData = buildProductFormData(values, files);

    updateMutation.mutate(
      { id, formData, onUploadProgress: onProgress },
      {
        onSuccess: () => {
          navigate("/seller/dashboard");
        },
        onError: (err) => {
          const msg = applyApiErrors(err, setError);
          if (msg) setBanner(msg);
        },
      },
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit product</h1>
      <div className="max-w-2xl">
        <ProductForm
          key={product._id}
          mode="edit"
          defaultValues={formDefaults}
          existingImages={product.images}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          bannerError={banner}
        />
      </div>
    </div>
  );
}
