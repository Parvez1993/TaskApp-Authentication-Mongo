require("dotenv").config();
require("./db/mongoose")
const express = require("express");
const cors = require("cors");
const User = require("./models/users");
const Task = require("./models/Task");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());



// Sample API Route
app.get("/", (req, res) => {
    res.send("Welcome to Mongo Express Server!");
});




//related to users

app.post("/users",(req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        res.send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})


app.post("/tasks",(req, res) => {
    const task = new Task(req.body);

    task.save().then(data => {
        res.send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
})


// Get all tasks
app.get("/tasks", (req, res) => {
    Task.find({})
        .then(tasks => {
            res.send(tasks);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


// Get a specific task by ID
app.get("/tasks/:id", (req, res) => {
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
app.delete("/tasks/:id", (req, res) => {
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
app.put("/tasks/:id", (req, res) => {
    Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
        .then(task => {
            if (!task) {
                return res.status(404).send({ error: "Task not found" });
            }
            res.send(task);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
