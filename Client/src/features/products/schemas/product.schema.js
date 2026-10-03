import { z } from "zod";
import { SIZE_ORDER } from "@/features/products/utils/sizes";

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .regex(/^[A-Za-z ]+$/, "Letters and spaces only (no numbers or symbols)"),

  discription: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters")
    .max(500, "Description must be at most 500 characters"),

  price: z.object({
    amount: z
      .number({ error: "Enter a valid price" })
      .min(0, "Price cannot be negative")
      .max(1_000_000, "Price cannot exceed 1,000,000"),
    currency: z.enum(["INR", "USD"]).default("INR"),
  }),

  sizes: z
    .array(
      z.object({
        size: z.enum(SIZE_ORDER, { error: "Select a valid size" }),
        stock: z
          .number({ error: "Enter a valid stock number" })
          .int("Stock must be a whole number")
          .min(0, "Stock cannot be negative"),
      }),
    )
    .min(1, "Add at least one size")
    .refine(
      (sizes) => {
        const seen = new Set();
        for (const s of sizes) {
          if (seen.has(s.size)) return false;
          seen.add(s.size);
        }
        return true;
      },
      { message: "Each size can only be added once" },
    ),
});
