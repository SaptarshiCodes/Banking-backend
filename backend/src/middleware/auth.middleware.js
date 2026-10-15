import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - invalid token",
      });
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - user not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in protectRoute:", err);

    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Unauthorized - invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};