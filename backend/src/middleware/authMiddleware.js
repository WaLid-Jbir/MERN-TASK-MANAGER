import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/userModel.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
    try {
        // check if the user is authenticated
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized, please login!",
            });
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get the user details from the token
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        // set the user in the request object
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized, please login!",
        });
    }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
        return;
    } else {
        res.status(403).json({
            success: false,
            message: "Unauthorized, you are not an admin!",
        });
    }
});