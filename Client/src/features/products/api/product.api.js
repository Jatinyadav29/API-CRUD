import { api } from "@/config/api";

export function getProducts() {
  return api.get("/product/getAll").then((res) => res.data.data.products);
}

export function getProduct(id) {
  return api
    .get(`/product/getSingle/${id}`)
    .then((res) => res.data.data.product);
}

export function deleteProduct(id) {
  return api.delete(`/product/delete/${id}`);
}

export function createProduct(formData, onUploadProgress) {
  return api
    .post("/product/create", formData, { onUploadProgress })
    .then((res) => res.data.data.product);
}

export function updateProduct(id, formData, onUploadProgress) {
  return api
    .put(`/product/update/${id}`, formData, { onUploadProgress })
    .then((res) => res.data.data.updatedProduct);
}
