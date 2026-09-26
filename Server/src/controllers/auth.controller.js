import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.util.js";

const registerController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const userAlreadyExist = await userModel.findOne({ email });

    if (userAlreadyExist) {
      return res.status(400).json({
        message: "User already exist with this email",
        errors: [
          {
            feild: "email",
            message: "User already exist with this email",
          },
        ],
      });
    }

    const user = await userModel.create({
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
    });

    const { accessToken, refreshToken } = generateToken({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.status(200).json({
      message: "User registered successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.log(`Error in register user controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const LoginController = async (req, res) => {};
const refreshTokenController = async (req, res) => {};
const getInfoController = async (req, res) => {};

export {
  registerController,
  LoginController,
  refreshTokenController,
  getInfoController,
};
