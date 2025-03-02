require("dotenv").config();
require("./db/mongoose")
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/users");
const taskRouter = require("./routes/tasks");




const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(cors());


//routers
app.use("/users",userRouter)
app.use("/tasks",taskRouter)

// Sample API Route
app.get("/", (req, res) => {
    res.send("Welcome to Mongo Express Server!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
