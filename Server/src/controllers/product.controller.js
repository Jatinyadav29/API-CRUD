import productModel from "../models/product.model.js";
import { uploadFiles, deleteFile } from "../services/imageKit.service.js";

const createProductController = async (req, res) => {
  try {
    const { title, discription, price, sizes } = req.body;

    const images = await Promise.all(
      req.files.map(async (file) => {
        const response = await uploadFiles({
          buffer: file.buffer,
          fileName: file.originalname,
        });

        return {
          fileId: response.fileId,
          url: response.url,
        };
      }),
    );

    const product = await productModel.create({
      title,
      discription,
      price: {
        amount: price.amount,
        currency: price.currency,
      },
      sizes,
      images,
      seller: req.user.id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: {
        product: {
          title: product.title,
          discription: product.discription,
          images: product.images,
          price: product.price,
          sizes: product.sizes,
        },
        sellerId: req.user.id,
      },
    });
  } catch (error) {
    console.log(`Error in create product controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find();

    return res.status(200).json({
      message: "All product fetched",
      data: { products },
    });
  } catch (error) {
    console.log(`Error in get all product controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getSingleProductsController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched",
      data: { product },
    });
  } catch (error) {
    console.log(`Error in get single product controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { title, discription, price, sizes } = req.body;

    const images = await Promise.all(
      req.files.map(async (file) => {
        const response = await uploadFiles({
          buffer: file.buffer,
          fileName: file.originalname,
        });

        return {
          fileId: response.fileId,
          url: response.url,
        };
      }),
    );

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        discription,
        images,
        price: {
          amount: price.amount,
          currency: price.currency,
        },
        sizes,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    await Promise.all(product.images.map((image) => deleteFile(image.fileId)));

    return res.status(200).json({
      message: "Product updated successfully",
      data: {
        updatedProduct,
      },
    });
  } catch (error) {
    console.log(`Error in update single product controller -${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Promise.all(
      product.images.map((image) => {
        deleteFile(image.fileId);
      }),
    );

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(`Error in delete single product controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createProductController,
  getAllProductsController,
  getSingleProductsController,
  updateSingleProductController,
  deleteSingleProductController,
};
