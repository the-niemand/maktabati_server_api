const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const BooksModel = require('../models/Books');
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



router.get('/checkIsSaved/:userId/:bookId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;

        const user = await UsersModel.find({ _id: userId });
        const result = user[0].savedBooks.includes(bookId)
        res.json({ data: result });

    } catch (error) {
        res.status(500).json({ error });
    }
})


router.get('/Saved/:userId/:bookId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;

        const result = await UsersModel.findByIdAndUpdate(
            userId,
            { $push: { savedBooks: bookId } },
            { new: true, useFindAndModify: false }
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



router.get('/RemoveSaved/:userId/:bookId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;

        // Find the user by ID and pull the bookId from the savedBooks array
        const result = await UsersModel.findByIdAndUpdate(
            userId,
            { $pull: { savedBooks: bookId } },
            { new: true, useFindAndModify: false } // Returns the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
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


// #############################################

router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        const email = data.email
        const user = await UsersModel.findOne({ email });
        if (user) {
            if (user.firstname == data.firstname && user.lastname == data.lastname && user.email == data.email) {
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 604800000
        });

        res.status(200).json({ id: user._id, message: "login successfully" })

    } catch (err) {

    }
})
// #############################################


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);
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

        if (newData.password) {
            const hashedPassword = await bcrypt.hash(newData.password, 10);
            newData.password = hashedPassword;
        }

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
