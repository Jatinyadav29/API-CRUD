import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProduct } from "@/features/products/api/product.api";
import { productKeys } from "@/features/products/api/productKeys";

export default function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData, onUploadProgress }) =>
      updateProduct(id, formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product updated");
    },
  });
}
