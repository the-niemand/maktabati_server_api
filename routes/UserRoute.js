const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');


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
