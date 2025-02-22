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




// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
