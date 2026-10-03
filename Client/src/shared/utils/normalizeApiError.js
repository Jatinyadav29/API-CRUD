export default function normalizeApiError(err) {
  const result = {
    message: "Something went wrong",
    status: null,
    fieldErrors: {},
  };

  if (!err.response) {
    result.message = "Cannot reach server";
    return result;
  }

  result.status = err.response.status;

  const data = err.response.data;

  if (!data || typeof data !== "object") {
    return result;
  }

  if (typeof data.message === "string" && data.message) {
    result.message = data.message;
  }

  if (Array.isArray(data.errors)) {
    for (const entry of data.errors) {
      const key = entry.feild || entry.field;
      if (key && entry.message) {
        result.fieldErrors[key] = entry.message;
      }
    }
  }

  return result;
}
