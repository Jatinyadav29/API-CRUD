import { useQuery } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/productKeys";
import { getProduct } from "@/features/products/api/product.api";

export default function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}
