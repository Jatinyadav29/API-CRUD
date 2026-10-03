export default function formatPrice({ amount, currency }) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const isWhole = Number.isInteger(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(amount);
}
