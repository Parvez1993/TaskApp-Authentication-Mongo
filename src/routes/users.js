const express = require('express');
const router = express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');


// CREATE - Create a new user
router.post("/", (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(user => {
            res.status(201).send(user)
        })
        .catch((err) => {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                // This is a duplicate email error
                return res.status(400).send({
                    error: "Email address is already in use. Please use a different email."
                });
            }
            // Handle other
            res.status(400).send(err);
        });
});

// READ (all users)
router.get("/", auth,(req, res) => {
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

router.post("/login", async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const generatedToken = await user.generateToken();
        res.send({user:user.getUserProfile(),token:generatedToken})
    }catch(err){
        res.status(500).send(err)
    }
})


// UPDATE (PUT)
router.put("/:id", async (req, res) => {
    try {
        // First find the user by ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Update user properties manually to ensure middleware gets triggered
        Object.keys(req.body).forEach(key => {
            user[key] = req.body[key];
        });

        // Save the user which will trigger the pre-save middleware
        await user.save();

        // Send the updated user in the response
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/deleteAll", (req, res) => {
    User.deleteMany({})
        .then(result => {
            res.send({
                message: "All users deleted successfully",
                count: result.deletedCount
            })
        }).catch(err => {
        res.status(500).send(err)
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



router.get("/users/me", auth,(req, res) => {
 res.send(req.user)
})


// Logout current session (removes current token)
router.post('/logout', auth, async (req, res) => {
    try {
        // Filter out the current token from the tokens array
        req.user.tokens = req.user.tokens.filter( (tokenObj) => {
            return tokenObj.token !== req.user;
        });

        // Save the user with the updated tokens array
        await req.user.save();

        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Logout failed' });
    }
});

// Logout from all sessions (removes all tokens)
router.post('/logoutAll', auth, async (req, res) => {
    try {
        // Clear all tokens
        req.user.tokens = [];

        // Save the user with the empty tokens array
        await req.user.save();

        res.send({ message: 'Logged out from all devices successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Logout failed' });
    }
});

module.exports = router;