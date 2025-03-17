import asyncHandler from 'express-async-handler';
import Task from '../../models/task/TaskModel.js';

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json('Title is required!'); 
    }

    if (!description || description.trim() === '') {
        res.status(400);
        res.status(400).json('Description is required!'); 
      }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      completed,
      priority,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);

  } catch (error) {
    
  }
});