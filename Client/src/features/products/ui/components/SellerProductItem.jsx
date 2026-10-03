import { Link } from "react-router";
import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";
import formatPrice from "@/shared/utils/formatPrice";
import imageUrl from "@/shared/utils/imageUrl";
import { isSoldOut } from "@/features/products/utils/sizes";

function getTotalStock(product) {
  if (!product.sizes || product.sizes.length === 0) return 0;
  return product.sizes.reduce((sum, s) => sum + s.stock, 0);
}

export default function SellerProductItem({
  product,
  onDelete,
  deleteDisabled,
}) {
  const soldOut = isSoldOut(product);
  const firstImage = product.images?.[0]?.url;
  const totalStock = getTotalStock(product);

  return (
    <>
      <tr className="hidden border-b border-neutral-100 md:table-row">
        <td className="py-3 pr-4">
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {firstImage ? (
                <img
                  src={imageUrl(firstImage, 120)}
                  alt={product.title}
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ImageOff
                    className="size-5 text-neutral-300"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-neutral-900">
              {product.title}
            </span>
          </div>
        </td>
        <td className="py-3 pr-4 text-sm text-neutral-700">
          {formatPrice(product.price)}
        </td>
        <td className="py-3 pr-4 text-sm text-neutral-500">{totalStock}</td>
        <td className="py-3 pr-4">
          {soldOut && (
            <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
              Sold out
            </span>
          )}
        </td>
        <td className="py-3">
          <div className="flex items-center gap-1">
            <Link
              to={`/products/${product._id}`}
              className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label={`View ${product.title}`}
            >
              <Eye className="size-4" />
            </Link>
            <Link
              to={`/seller/products/${product._id}/edit`}
              className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label={`Edit ${product.title}`}
            >
              <Pencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(product)}
              disabled={deleteDisabled}
              className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
              aria-label={`Delete ${product.title}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </td>
      </tr>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 md:hidden">
        <div className="flex gap-3">
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            {firstImage ? (
              <img
                src={imageUrl(firstImage, 120)}
                alt={product.title}
                loading="lazy"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ImageOff
                  className="size-5 text-neutral-300"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-neutral-900">
                {product.title}
              </h3>
              {soldOut && (
                <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                  Sold out
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-neutral-700">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-neutral-500">Stock: {totalStock}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 border-t border-neutral-100 pt-3">
          <Link
            to={`/products/${product._id}`}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label={`View ${product.title}`}
          >
            <Eye className="size-4" />
          </Link>
          <Link
            to={`/seller/products/${product._id}/edit`}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label={`Edit ${product.title}`}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            disabled={deleteDisabled}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
            aria-label={`Delete ${product.title}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
