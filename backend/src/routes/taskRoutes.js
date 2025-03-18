import express from 'express';
import { createTask, getTasks, getTask, updateTask } from '../controllers/task/taskController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// create task
router.post('/task/create', protectRoute, createTask);

// get user tasks
router.get('/tasks', protectRoute, getTasks);

// get task by id
router.get('/task/:id', protectRoute, getTask);

// update task
router.patch('/task/:id', protectRoute, updateTask);

export default router;