import { useQuery } from "@tanstack/react-query";
import { productKeys } from "@/features/products/api/productKeys";
import { getProducts } from "@/features/products/api/product.api";

export default function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: getProducts,
  });
}
