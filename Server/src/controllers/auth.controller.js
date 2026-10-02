import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken, verifyRefreshToken } from "../utils/auth.util.js";

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
          role: user.role,
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

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, email or password invalid",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Unauthorized, email or password invalid",
      });
    }

    const { accessToken, refreshToken } = generateToken({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.log(`Error in login controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await userModel.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null },
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log(`Error in logout controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const decode = verifyRefreshToken(refreshToken);

    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (refreshToken !== user.refreshToken) {
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      return res.status(400).json({
        message: "Unauthorized, refresh token invalid",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken({
      userId: user._id,
      role: user.role,
    });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    return res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.log(`Error in refresh token controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getInfoController = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(`Error in get info controller - ${error}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  getInfoController,
};
