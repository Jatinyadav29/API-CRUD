import { Link } from "react-router";
import { ImageOff } from "lucide-react";
import formatPrice from "@/shared/utils/formatPrice";
import imageUrl from "@/shared/utils/imageUrl";
import { isSoldOut } from "@/features/products/utils/sizes";

export default function ProductCard({ product }) {
  const soldOut = isSoldOut(product);
  const firstImage = product.images?.[0]?.url;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {firstImage ? (
          <img
            src={imageUrl(firstImage, 400)}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff className="size-10 text-neutral-300" aria-hidden="true" />
          </div>
        )}

        {soldOut && (
          <span className="absolute left-2 top-2 rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-neutral-900">
          {product.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-neutral-700">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
