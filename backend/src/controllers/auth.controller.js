import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { sendRegistrationEmail } from "../services/email.service.js";

export const userRegisterController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Name, email and password are required",
        status: "Failed",
      });
    }

    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "User already exists with this email, try logging in",
        status: "Failed",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    try {
      await sendRegistrationEmail(user.email, user.name);
    } catch (error) {
      console.error("Registration email failed:", error);
    }

    return res.status(201).json({
      status: "Success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
        status: "Failed",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      status: "Failed",
    });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: "Failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
        sttus: "Failed",
      });
    }

    const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
      status: "Failed",
    });
  }
};
