import { useState } from "react";
import { ImageOff } from "lucide-react";
import imageUrl from "@/shared/utils/imageUrl";

export default function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-neutral-100">
        <ImageOff className="size-16 text-neutral-300" aria-hidden="true" />
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={imageUrl(activeImage.url, 900)}
          alt={`Product image ${activeIndex + 1}`}
          className="size-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img._id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-current={idx === activeIndex ? "true" : undefined}
              aria-label={`View image ${idx + 1}`}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                idx === activeIndex
                  ? "border-neutral-900"
                  : "border-transparent hover:border-neutral-300"
              }`}
            >
              <img
                src={imageUrl(img.url, 120)}
                alt={`Thumbnail ${idx + 1}`}
                loading="lazy"
                className="size-16 object-cover sm:size-20"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
