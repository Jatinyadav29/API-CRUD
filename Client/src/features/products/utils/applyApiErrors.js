import normalizeApiError from "@/shared/utils/normalizeApiError";

const FORM_FIELDS = new Set([
  "title",
  "discription",
  "images",
  "price",
  "price.amount",
  "price.currency",
]);

export default function applyApiErrors(err, setError) {
  if (!err?.response) {
    return "Cannot reach server";
  }

  const e = normalizeApiError(err);

  if (
    e.status === 500 ||
    !err.response.data ||
    typeof err.response.data !== "object"
  ) {
    return "Upload failed. Check your images and try again.";
  }

  let banner = "";
  let hasFieldError = false;

  if (e.fieldErrors && Object.keys(e.fieldErrors).length > 0) {
    for (const [key, message] of Object.entries(e.fieldErrors)) {
      if (FORM_FIELDS.has(key) || /^sizes\.\d+\.(size|stock)$/.test(key)) {
        setError(key, { message });
        hasFieldError = true;
      } else {
        banner = banner ? `${banner}; ${message}` : message;
      }
    }
  }

  if (!hasFieldError && !banner) {
    banner = e.message;
  }

  return banner;
}
