import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Enter full product name"],
    maxlength: [50, "Please enter a name shorter than 50 characters"],
  },

  discription: {
    type: String,
    required: true,
    minlength: [50, "Please add a discription of atleast 50 characters"],
    maxlength: [500, "Plaese enter a discription shorter than 500 characters"],
  },

  images: {
    type: [
      {
        fileId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    validate: {
      validator: (image) => image.length <= 5,
      message: "Maximum 5 images are allowed",
    },
  },

  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
  },

  sizes: [
    {
      size: {
        type: String,
        enum: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
        required: true,
      },
      stock: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  ],

  seller: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const productModel = mongoose.model("products", productSchema);

export default productModel;
