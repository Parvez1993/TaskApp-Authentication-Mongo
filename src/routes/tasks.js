const express = require('express');
const Task = require('../models/task');
const taskRouter = express.Router();
const auth = require('../middleware/auth');

// Create a new task
taskRouter.post("/", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id  // Make sure req.user._id exists
        });

        await task.save();
        res.status(201).send(task);
    } catch (err) {
        console.error('Task creation error:', err);
        res.status(400).send(err);
    }
});

// Get all tasks?completed=true&limit=10&skip=1
taskRouter.get("/", auth, async (req, res) => {
    try {
        const match = {};


        //check again Boolean
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                skip: req.query.skip,
                limit: req.query.limit,
                sort:{
                    createdAt: -1
                }
            }
        });

        res.send(req.user.tasks);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

// Get a specific task by ID
taskRouter.get("/:id", auth, (req, res) => {
    Task.findOne({_id: req.params.id, owner: req.user._id})
        .then(task => {
            if (!task) {
                return res.status(404).send({error: "Task not found"});
            }
            res.send(task);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// DELETE a task by ID
taskRouter.delete("/:id", (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).send({error: "Task not found"});
            }
            res.send({message: "Task deleted successfully", task});
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// UPDATE a task by ID (PUT method)
taskRouter.put("/:id", async (req, res) => {
    const tasks = await Task.findById(req.params.id)
    if (!tasks) {
        return res.status(404).send({error: "Task not found"});
    }
    Object.keys(req.body).forEach(key => {
        tasks[key] = req.body[key];
    })
    await tasks.save()
    res.send(tasks);
});

module.exports = taskRouter;