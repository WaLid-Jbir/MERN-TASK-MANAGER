import express from 'express';
import { registerUser, loginUser, logoutUser, getUser, updateUser, userLoginStatus, verifyEmail, verifyUser, forgotPassword, resetPassword } from '../controllers/auth/userController.js';
import { deleteUser, getAllUsers } from '../controllers/auth/adminController.js';
import { protectRoute, adminMiddleware, creatorMiddleware, verifiedMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/user', protectRoute, getUser);
router.patch('/user', protectRoute, updateUser);

// admin routes
router.delete('/admin/users/:id', protectRoute, adminMiddleware, deleteUser);

// get all users
router.get('/admin/users', protectRoute, creatorMiddleware, getAllUsers);

// login status
router.get('/login-status', userLoginStatus);

// verify user ==> email verification
router.post('/verify-email', protectRoute, verifyEmail);

// verify user ==> email verification
router.post('/verify-user/:verificationToken', verifyUser);

// forgot password
router.post('/forgot-password', forgotPassword);

// reset password
router.post('/reset-password/:resetPasswordToken', resetPassword);

export default router;