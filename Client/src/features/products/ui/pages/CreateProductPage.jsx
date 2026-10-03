import { useState } from "react";
import { useNavigate } from "react-router";
import useCreateProduct from "@/features/products/hook/useCreateProduct";
import useDocumentTitle from "@/shared/hook/useDocumentTitle";
import buildProductFormData from "@/features/products/utils/buildProductFormData";
import applyApiErrors from "@/features/products/utils/applyApiErrors";
import ProductForm from "@/features/products/ui/components/ProductForm";

export default function CreateProductPage() {
  useDocumentTitle("Add product");

  const navigate = useNavigate();
  const createMutation = useCreateProduct();
  const [banner, setBanner] = useState("");

  function handleSubmit(values, files, onProgress, setError) {
    setBanner("");
    const formData = buildProductFormData(values, files);

    createMutation.mutate(
      { formData, onUploadProgress: onProgress },
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
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Add product</h1>
      <div className="max-w-2xl">
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          bannerError={banner}
        />
      </div>
    </div>
  );
}
