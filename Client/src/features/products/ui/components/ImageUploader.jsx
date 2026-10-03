import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Upload, X, ImageOff } from "lucide-react";
import compressImage from "@/shared/utils/compressImage";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 1024 * 1024;

function isDuplicate(file, existing) {
  return existing.some(
    (f) =>
      f.name === file.name &&
      f.size === file.size &&
      f.lastModified === file.lastModified,
  );
}

export default function ImageUploader({
  value = [],
  onChange,
  error,
  max = 5,
}) {
  const [fileErrors, setFileErrors] = useState([]);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const previews = useMemo(
    () => value.map((f) => URL.createObjectURL(f)),
    [value],
  );

  const prevUrlsRef = useRef([]);
  useEffect(() => {
    const oldUrls = prevUrlsRef.current;
    prevUrlsRef.current = previews;
    return () => {
      oldUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previews]);

  const processFiles = useCallback(
    async (incoming) => {
      const errors = [];
      const accepted = [];

      for (const file of incoming) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          errors.push(`${file.name}: not a supported image type`);
          continue;
        }

        if (isDuplicate(file, value)) {
          continue;
        }

        if (value.length + accepted.length >= max) {
          errors.push(`Maximum ${max} images allowed`);
          break;
        }

        if (file.size > MAX_BYTES) {
          const compressed = await compressImage(file);
          if (compressed) {
            accepted.push(compressed);
          } else {
            errors.push(`${file.name} is too large (max 1 MB)`);
          }
        } else {
          accepted.push(file);
        }
      }

      setFileErrors(errors);
      if (accepted.length > 0) {
        onChange([...value, ...accepted]);
      }
    },
    [value, onChange, max],
  );

  function handleInputChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) processFiles(files);
    e.target.value = "";
  }

  function handleRemove(index) {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    setFileErrors([]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) processFiles(files);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-neutral-900 bg-neutral-50"
            : error
              ? "border-red-400 bg-red-50/50"
              : "border-neutral-300 bg-neutral-50 hover:border-neutral-400"
        }`}
      >
        <Upload className="size-6 text-neutral-400" aria-hidden="true" />
        <p className="text-sm text-neutral-500">
          Drag and drop images, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-neutral-900 underline hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-neutral-400">
          {value.length}/{max} images · JPEG, PNG, WebP · max 1 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload product images"
        />
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((url, i) => (
            <div key={url} className="group relative">
              <img
                src={url}
                alt={`Upload preview ${i + 1}`}
                className="size-20 rounded-lg border border-neutral-200 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-neutral-900 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && !error && (
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <ImageOff className="size-4" aria-hidden="true" />
          No images added
        </div>
      )}

      {fileErrors.length > 0 && (
        <div className="space-y-1">
          {fileErrors.map((msg) => (
            <p key={msg} className="text-xs text-red-600">
              {msg}
            </p>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
