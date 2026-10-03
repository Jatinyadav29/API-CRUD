import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProduct } from "@/features/products/api/product.api";
import { productKeys } from "@/features/products/api/productKeys";

export default function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      createProduct(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created");
    },
  });
}
