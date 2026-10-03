export const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export function sortSizes(sizes) {
  if (!sizes) return [];
  return [...sizes].sort(
    (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
  );
}

export function isSoldOut(product) {
  if (!product?.sizes || product.sizes.length === 0) return true;
  return product.sizes.every((s) => s.stock <= 0);
}
