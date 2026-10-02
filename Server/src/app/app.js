import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "../routes/auth.router.js";
import productRoutes from "../routes/product.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello world",
  });
});

export default app;
