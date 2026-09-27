import * as z from "zod";

const registerSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),

  name: z
    .string("Name is required")
    .trim()
    .refine((value) => value.trim().length > 0, {
      error: "Name cannot be empty or spaces only",
      abort: true,
    })
    .min(3, "Enter your full name")
    .max(50, "Name cannot exceed 50 character limit"),

  password: z
    .string("Password is required")
    .trim()
    .refine((value) => value.trim().length > 0, {
      error: "Name cannot be empty or spaces only",
      abort: true,
    })
    .min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),

  password: z
    .string("Password is required")
    .trim()
    .refine((value) => value.trim().length > 0, {
      error: "Name cannot be empty or spaces only",
      abort: true,
    })
    .min(8, "Password must be at least 8 characters"),
});

export { registerSchema, loginSchema };
