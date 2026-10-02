import mongoose from "mongoose";
import * as z from "zod";

const idValidateSchema = z.object({
  id: z
    .string("Product id is required")
    .refine((id) => mongoose.Types.ObjectId.isValid(id), "Invalid product ID"),
});

export default idValidateSchema;
