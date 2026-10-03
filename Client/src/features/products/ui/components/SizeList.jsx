import { sortSizes } from "@/features/products/utils/sizes";

export default function SizeList({ sizes }) {
  const sorted = sortSizes(sizes);

  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((s) => {
        const outOfStock = s.stock <= 0;
        const lowStock = !outOfStock && s.stock >= 1 && s.stock <= 5;

        return (
          <span
            key={s.size}
            className={`inline-flex flex-col items-center rounded-md border px-3 py-1.5 text-sm ${
              outOfStock
                ? "border-neutral-200 text-neutral-400 line-through"
                : "border-neutral-300 text-neutral-700"
            }`}
          >
            {s.size}
            {lowStock && (
              <span className="text-[10px] leading-tight text-amber-600">
                Only {s.stock} left
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
