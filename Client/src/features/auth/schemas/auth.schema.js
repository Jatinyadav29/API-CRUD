import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be 50 characters or fewer")
    .refine((val) => val.length > 0, { message: "Name is required" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),
});
