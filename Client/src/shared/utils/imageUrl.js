export default function imageUrl(url, width) {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}tr=w-${width}`;
}
