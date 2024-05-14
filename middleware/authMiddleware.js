import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ status: false, message: "Non autorisé. Veuillez essayer de vous connecter à nouveau."
 });
    }
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Non autorisé. Veuillez essayer de vous connecter à nouveau."
 });
  }
});

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Non autorisé en tant qu'administrateur. Veuillez essayer de vous connecter en tant qu'administrateur.",
    });
  }
};

export { isAdminRoute, protectRoute };
