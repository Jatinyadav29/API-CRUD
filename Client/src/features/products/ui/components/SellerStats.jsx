import { isSoldOut } from "@/features/products/utils/sizes";

export default function SellerStats({ products }) {
  const total = products.length;
  const soldOutCount = products.filter(isSoldOut).length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-500">Total products</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{total}</p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-500">Sold out</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{soldOutCount}</p>
      </div>
    </div>
  );
}
