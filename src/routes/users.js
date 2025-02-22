const express = require('express');
const router = express.Router();
const User = require('../models/users');

// CREATE - Create a new user
router.post("/", (req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        res.status(201).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

// READ (all users)
router.get("/", (req, res) => {
    User.find({})
        .then(users => {
            res.send(users)
        }).catch(err => {
        res.status(500).send(err)
    })
})

// READ (single user by ID)
router.get("/:id", (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" })
            }
            res.send(user)
        }).catch(err => {
        res.status(500).send(err)
    })
})

// UPDATE (PUT)
router.put("/:id", (req, res) => {
    User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" })
            }
            res.send(user)
        }).catch(err => {
        res.status(400).send(err)
    })
})

// DELETE
router.delete("/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" })
            }
            res.send({ message: "User deleted successfully", user })
        }).catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router;