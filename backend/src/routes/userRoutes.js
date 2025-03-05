import express from 'express';
import { registerUser, loginUser, logoutUser, getUser } from '../controllers/auth/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/user', protectRoute, getUser);

export default router;