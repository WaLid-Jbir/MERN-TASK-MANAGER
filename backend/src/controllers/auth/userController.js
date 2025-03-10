import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../../models/auth/userModel.js";
import Token from "../../models/auth/tokenModel.js";
import { generateToken } from "../../helpers/generateToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";

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

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "User logged out",
    });
});

export const getUser = asyncHandler(async (req, res) => {

    // get user details from token
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.status(200).json({ user });
    } else {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
});

export const updateUser = asyncHandler(async (req, res) => {

    // get user details from token
    const user = await User.findById(req.user._id);

    if (user) {
        const { name, photo, bio } = req.body;
        // update user
        user.name = name || user.name;
        user.photo = photo || user.photo;
        user.bio = bio || user.bio;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            bio: updatedUser.bio,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
        });
    }else {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
});

// login status
export const userLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, please login!",
        });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        return res.status(200).json(true);
    }
    else {
        return res.status(401).json(false);
    }
});

// email verification
export const verifyEmail = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "User already verified",
        });
    }

    let token = await Token.findOne({ userId: user._id });

    // delete old token
    if (token) {
        await token.deleteOne();
    }

    // create new verification token
    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

    // hash token
    const hashedToken = await hashToken(verificationToken);

    // save token to database
    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }).save();

    // create verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // send email
    const subject = "Email Verification - TASK_MNG";
    const send_to = user.email;
    const reply_to = "noreply@gmail.com";
    const template = "emailVerification";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const url = verificationLink;

    try {
        await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
        res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email",
        });
    } catch (error) {
        console.log("Error sending email: ", error);
        return res.status(500).json({
            success: false,
            message: "Email could not be sent, please try again",
        });
    }
});

// verify user
export const verifyUser = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    if (!verificationToken) {
        return res.status(400).json({
            success: false,
            message: "Invalid verification token",
        });
    }

    // hash the token because it was hashed before saving to the database
    const hashedToken = await hashToken(verificationToken);

    // find user with the verification token
    const userToken = await Token.findOne({
        verificationToken: hashedToken,
        expiredAt: { $gt: Date.now() },
    });

    if (!userToken) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token",
        });
    }

    // find user with the userId from the token
    const user = await User.findById(userToken.userId);

    if(user.isVerifiied){
        return res.status(400).json({
            success: false,
            message: "User already verified",
        });
    }

    // update user
    user.isVerified = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: "User verified successfully",
    });

});

// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide an email",
        });
    }

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    // see if the token exists
    let token = await Token.findOne({ userId: user._id });

    // delete old token
    if (token) {
        await token.deleteOne();
    }

    // create a reset password token using the user id
    const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

    // hash token
    const hashedToken = await hashToken(passwordResetToken);

    // save token to database
    await new Token({
        userId: user._id,
        passwordResetToken: hashedToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + 60 * 60 * 1000, // 1 hour
    }).save();

    // reset password link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

    // send email
    const subject = "Password Reset - TASK_MNG";
    const send_to = user.email;
    const reply_to = "noreply@gmail.com";
    const template = "forgotPassword";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const url = resetLink;

    try {
        await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
        res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email",
        });
    } catch (error) {
        console.log("Error sending forgot password email: ", error);
        return res.status(500).json({
            success: false,
            message: "Email could not be sent, please try again",
        });
    }

});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
    const { resetPasswordToken } = req.params;
    const { password } = req.body;

    if(!password){
        return res.status(400).json({
            success: false,
            message: "Please provide a password",
        });
    }

    // hash the token because it was hashed before saving to the database
    const hashedToken = await hashToken(resetPasswordToken);

    // check if token exists and still valid
    const userToken = await Token.findOne({
        passwordResetToken: hashedToken,
        expiredAt: { $gt: Date.now() },
    });

    if (!userToken) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired password reset token",
        });
    }

    // find user with the userId from the token
    const user = await User.findById(userToken.userId);

    // update user password
    user.password = password;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});

// change password
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // get user id from the token
    const user = await User.findById(req.user.id);

    // compare current password with the one in the database
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid password!",
        });
    }

    // reset password
    if (isPasswordMatch) {
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }else {
        return res.status(400).json({
            success: false,
            message: "Password could not be changed!",
        });
    }

});