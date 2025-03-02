const express = require('express');
const Task = require('../models/task');
const taskRouter = express.Router();

// Create a new task
taskRouter.post("/", (req, res) => {
    const task = new Task(req.body);

    task.save().then(data => {
        res.status(201).send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

// Get all tasks
taskRouter.get("/", (req, res) => {
    Task.find({})
        .then(tasks => {
            res.send(tasks);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Get a specific task by ID
taskRouter.get("/:id", (req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).send({ error: "Task not found" });
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
                return res.status(404).send({ error: "Task not found" });
            }
            res.send({ message: "Task deleted successfully", task });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// UPDATE a task by ID (PUT method)
taskRouter.put("/:id", async (req, res) => {
    const tasks = await Task.findById(req.params.id)
    if(!tasks) {
        return res.status(404).send({ error: "Task not found" });
    }
    Object.keys(req.body).forEach(key => {
        tasks[key] = req.body[key];
    })
    await tasks.save()
    res.send(tasks);
});

module.exports = taskRouter;