import * as z from "zod";

const productSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(3, "Please enter full name of the product")
    .max(50, "Product name should not exceed 50 characters")
    .regex(/^[A-Za-z ]+$/, "Title must contain English letter and spaces only"),

  discription: z
    .string("Discription is required")
    .trim()
    .min(50, "Please enter atleat 50 character discription")
    .max(500, "Discription must be within 500 characters limit"),

  price: z.object({
    amount: z.number("Amount is required").min(0, "Amount can't be negative"),
    currency: z.enum(["INR", "USD"]).default("INR").optional(),
  }),

  sizes: z.array(
    z.object({
      size: z.enum(["XXS", "XS", "S", "M", "L", "XL", "XXL"], {
        error: "Invalid size",
      }),
      stock: z
        .number()
        .int()
        .min(0, "Stock can't be negative")
        .default(0)
        .optional(),
    }),
  ),
});

export default productSchema;
