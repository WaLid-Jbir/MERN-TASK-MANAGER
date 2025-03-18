import asyncHandler from 'express-async-handler';
import Task from '../../models/task/TaskModel.js';

// create task
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
      priority,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);

  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(500).json({ message: error.message });
  }
});

// get tasks
export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId });
    res.status(200).json({
        length: tasks.length,
        tasks
    });
  } catch (error) {
    console.log("Error fetching tasks: ", error);
    res.status(500).json({ message: error.message });
  }
});

// get single task
export const getTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const {id} = req.params;

        if(!id) {
            res.status(400).json({ message: "Task id is required!" });
        }

        const task = await Task.findById(id);

        if(!task) {
            res.status(404).json({ message: "Task not found!" });
        }

        if(!task.user.equals(userId)) {
            res.status(403).json({ message: "You are not authorized to view this task!" });
        }

        res.status(200).json(task);

    } catch (error) {
        console.log("Error fetching task: ", error);
        res.status(500).json({ message: error.message });
    }
});