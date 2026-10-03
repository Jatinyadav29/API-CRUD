import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { SIZE_ORDER } from "@/features/products/utils/sizes";

export default function SizesEditor({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const usedSizes = fields.map((f) => f.size);

  function availableSizes(currentSize) {
    return SIZE_ORDER.filter(
      (s) => s === currentSize || !usedSizes.includes(s),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">Sizes</label>
        <button
          type="button"
          onClick={() => append({ size: "", stock: 0 })}
          disabled={fields.length >= SIZE_ORDER.length}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add size
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => {
          const sizeError = errors?.sizes?.[index]?.size?.message;
          const stockError = errors?.sizes?.[index]?.stock?.message;

          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <select
                  {...register(`sizes.${index}.size`)}
                  aria-label={`Size ${index + 1}`}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 ${
                    sizeError ? "border-red-500" : "border-neutral-300"
                  }`}
                >
                  <option value="">Select size</option>
                  {availableSizes(field.size).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {sizeError && (
                  <p className="mt-1 text-xs text-red-600">{sizeError}</p>
                )}
              </div>

              <div className="w-24">
                <input
                  type="number"
                  min="0"
                  step="1"
                  {...register(`sizes.${index}.stock`, { valueAsNumber: true })}
                  placeholder="Stock"
                  aria-label={`Stock for size ${index + 1}`}
                  className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 ${
                    stockError ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {stockError && (
                  <p className="mt-1 text-xs text-red-600">{stockError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                className="mt-2 rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50"
                aria-label={`Remove size ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {errors?.sizes?.root?.message && (
        <p className="text-xs text-red-600">{errors.sizes.root.message}</p>
      )}
      {typeof errors?.sizes?.message === "string" && (
        <p className="text-xs text-red-600">{errors.sizes.message}</p>
      )}
    </div>
  );
}
