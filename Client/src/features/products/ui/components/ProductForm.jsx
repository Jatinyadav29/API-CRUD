import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { productSchema } from "@/features/products/schemas/product.schema";
import Input from "@/shared/ui/components/Input";
import Button from "@/shared/ui/components/Button";
import ImageUploader from "@/features/products/ui/components/ImageUploader";
import SizesEditor from "@/features/products/ui/components/SizesEditor";
import imageUrl from "@/shared/utils/imageUrl";

export default function ProductForm({
  mode = "create",
  defaultValues,
  existingImages,
  onSubmit: onSubmitProp,
  isSubmitting,
  bannerError,
}) {
  const [files, setFiles] = useState([]);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      title: "",
      discription: "",
      price: { amount: "", currency: "INR" },
      sizes: [{ size: "", stock: 0 }],
    },
  });

  const discription = watch("discription", "");
  const charCount = (discription || "").length;

  const handleBeforeUnload = useCallback(
    (e) => {
      if (isDirty || files.length > 0) {
        e.preventDefault();
      }
    },
    [isDirty, files.length],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  function handleFormSubmit(values) {
    if (files.length === 0) {
      setImageError("Add at least one image");
      return;
    }
    setImageError("");

    const onProgress = (e) => {
      if (e.total) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    onSubmitProp(values, files, onProgress, setError);
  }

  const buttonLabel = isSubmitting
    ? `Uploading ${uploadProgress}%`
    : mode === "create"
      ? "Create product"
      : "Save changes";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-6"
    >
      {bannerError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {bannerError}
        </div>
      )}

      <Input
        label="Title"
        placeholder="e.g. Cotton Shirt"
        error={errors.title?.message}
        disabled={isSubmitting}
        {...register("title")}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="discription"
          className="text-sm font-medium text-neutral-700"
        >
          Description
        </label>
        <textarea
          id="discription"
          rows={4}
          placeholder="Describe the product in detail (at least 50 characters)…"
          disabled={isSubmitting}
          aria-invalid={errors.discription ? "true" : undefined}
          className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 disabled:opacity-50 ${
            errors.discription
              ? "border-red-500 focus:ring-red-500"
              : "border-neutral-300 hover:border-neutral-400"
          }`}
          {...register("discription")}
        />
        <div className="flex justify-between">
          {errors.discription ? (
            <p className="text-xs text-red-600">{errors.discription.message}</p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${
              charCount > 500 ? "text-red-600" : "text-neutral-400"
            }`}
          >
            {charCount}/500
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price"
          type="number"
          min="0"
          max="1000000"
          step="any"
          placeholder="0"
          error={errors.price?.amount?.message}
          disabled={isSubmitting}
          {...register("price.amount", { valueAsNumber: true })}
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-neutral-700"
          >
            Currency
          </label>
          <select
            id="currency"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 disabled:opacity-50"
            {...register("price.currency")}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
          {errors.price?.currency && (
            <p className="text-xs text-red-600">
              {errors.price.currency.message}
            </p>
          )}
        </div>
      </div>

      <SizesEditor control={control} register={register} errors={errors} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Images <span className="text-neutral-400">(required)</span>
        </label>

        {mode === "edit" && existingImages && existingImages.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Saving replaces all current images. Upload the full set of
                images again.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <img
                    key={img._id || i}
                    src={imageUrl(img.url, 80)}
                    alt={`Current image ${i + 1}`}
                    className="size-14 rounded-md border border-amber-200 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <ImageUploader
          value={files}
          onChange={setFiles}
          error={imageError}
          max={5}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
        <Button type="submit" loading={isSubmitting} className="min-w-40">
          {buttonLabel}
        </Button>
        <Link
          to="/seller/dashboard"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
