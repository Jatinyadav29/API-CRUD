import { Router } from "express";
import { authenticate, isSeller } from "../middlewares/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validation.middleware.js";
import productSchema from "../validators/product.zod.js";
import {
  createProductController,
  deleteSingleProductController,
  getAllProductsController,
  getSingleProductsController,
  updateSingleProductController,
} from "../controllers/product.controller.js";
import upload from "../config/multer.js";
import idValidateSchema from "../validators/id.zod.js";

const router = Router();

router.post(
  "/create",
  authenticate,
  isSeller,
  upload.array("images"),

  (req, res, next) => {
    req.body.price = JSON.parse(req.body.price);
    req.body.sizes = JSON.parse(req.body.sizes);

    next();
  },

  validateBody(productSchema),
  createProductController,
);

router.get("/getAll", getAllProductsController);
router.get(
  "/getSingle/:id",
  validateParams(idValidateSchema),
  getSingleProductsController,
);

router.put(
  "/update/:id",
  authenticate,
  isSeller,
  validateParams(idValidateSchema),

  upload.array("images"),

  (req, res, next) => {
    req.body.price = JSON.parse(req.body.price);
    req.body.sizes = JSON.parse(req.body.sizes);

    next();
  },

  validateBody(productSchema),
  updateSingleProductController,
);

router.delete(
  "/delete/:id",
  authenticate,
  isSeller,
  validateParams(idValidateSchema),
  deleteSingleProductController,
);

export default router;
