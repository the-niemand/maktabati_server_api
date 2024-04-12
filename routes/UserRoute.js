const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


router.use(express.json());

router.get('/fetchUsers', async (req, res) => {
    try {
        const users = await UsersModel.find({});
        res.json({ data: users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/fetchUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UsersModel.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/createUser', async (req, res) => {
    try {
        const data = req.body;
        const user = new UsersModel(data);
        const savedUser = await user.save();
        res.status(201).json({ data: savedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// #############################################

router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        const email = data.email
        const user = await UsersModel.findOne({ email });
        if (user) {
            if (user.Fullname == data.Fullname && user.email == data.email) {
                res.status(409).json({ message: "User already exist" })
            } else if (user.email == data.email) {
                res.status(409).json({ message: "email already exist" })
            }

        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = new UsersModel({
            ...data,
            password: hashedPassword
        })
        const savedUser = await newUser.save();

        res.status(200).json({ savedUser, message: "user register successfully" })
    } catch (err) {


    }
})

// #############################################
router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        const email = data.email
        const user = await UsersModel.findOne({ email });
        if (!user) {
            res.status(409).json({ message: "User does not exist" })
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password)

        if (!isPasswordValid) {
            res.status(409).json({ message: "Password is incorrect" })
        }

        const token = jwt.sign({ id: user._id }, "secret")
        res.json({token , user_id : user._id});
    } catch (err) {

    }
})
// #############################################






router.delete('/deleteUserById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await UsersModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/updateUserById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const updatedUser = await UsersModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
