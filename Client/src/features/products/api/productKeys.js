export const productKeys = {
  all: ["products"],
  list: () => [...productKeys.all, "list"],
  detail: (id) => [...productKeys.all, "detail", id],
};
