import express from 'express';
import { createTask } from '../controllers/task/taskController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/task/create', protectRoute, createTask);

export default router;