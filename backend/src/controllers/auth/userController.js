import asyncHandler from "express-async-handler";
import User from "../../models/auth/userModel.js";
import { generateToken } from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    // validation
    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Please fill in all fields",
        });
    }

    // chack password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters",
        });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        })
    }

    // create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // generate token
    const token = generateToken(user._id);

    // set cookie
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: true,
        secure: true,
    });

    if (user) {
        const { _id, name, email, role, photo, bio, isVerified } = user;
        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    }else {
        res.status(400).json({
            success: false,
            message: "Invalid user data",
        });
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Please fill in all fields",
        });
    }

    // chack if user exists
    const userExists = await User.findOne({ email });

    if (!userExists) {
        return res.status(400).json({
            success: false,
            message: "User does not exist, sign up first",
        });
    }

    // check if password matches the one in the database
    const isPasswordMatch = await bcrypt.compare(password, userExists.password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    // generate token
    const token = generateToken(userExists._id);

    if(userExists && isPasswordMatch) {
        const { _id, name, email, role, photo, bio, isVerified } = userExists;

        // set cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true,
        });

        res.status(200).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Invalid credentials",
        });
    }

});