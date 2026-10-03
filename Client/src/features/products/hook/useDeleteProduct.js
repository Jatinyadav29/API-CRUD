import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProduct } from "@/features/products/api/product.api";
import { productKeys } from "@/features/products/api/productKeys";
import normalizeApiError from "@/shared/utils/normalizeApiError";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      toast.success("Product deleted");
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        queryClient.invalidateQueries({ queryKey: productKeys.all });
        toast.info("Product was already removed");
      } else {
        toast.error(normalizeApiError(error).message);
      }
    },
  });
}
