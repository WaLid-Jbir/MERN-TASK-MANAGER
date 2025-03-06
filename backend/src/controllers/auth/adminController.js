import asyncHandler from "express-async-handler";
import User from "../../models/auth/userModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
    
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot delete user",
        });
    }
});

// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});

        if (!users) {
            res.status(404).json({
                success: false,
                message: "No users found!",
            });
        }
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot get users",
        });
    }
});