require("dotenv").config();
require("./db/mongoose")
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/users");
const taskRouter = require("./routes/tasks");
const multer=require("multer");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(cors());
//routers
app.use("/users",userRouter)
app.use("/tasks",taskRouter)


//multer
//multer
const upload = multer({
    dest: "./uploads/",
    limits: {
        fileSize: 1000*1000
    },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error("Only pdf files allowed"));
        }
        cb(undefined, true);
    }
})

app.post('/upload', upload.single('upload'), (req, res)=>{
    res.send()
})











// Sample API Route
app.get("/", (req, res) => {
    res.send("Welcome to Mongo Express Server!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
