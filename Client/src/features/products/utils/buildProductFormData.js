export default function buildProductFormData(values, files) {
  const fd = new FormData();
  fd.append("title", values.title);
  fd.append("discription", values.discription);
  fd.append("price", JSON.stringify(values.price));
  fd.append(
    "sizes",
    JSON.stringify(values.sizes.map((s) => ({ size: s.size, stock: s.stock }))),
  );
  for (const file of files) {
    fd.append("images", file);
  }
  return fd;
}
