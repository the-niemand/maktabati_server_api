const express = require('express');
const app = express();
const router = express.Router();

require('../config/connect');


app.use(express.json());
const UsersModel = require('../models/Users');



router.get('/fetchUsers', async (req, res) => {
     try {
          const users = await UsersModel.find({});
          res.send(users);
     } catch (err) {
          res.status(500).send(err);
     }
});




router.get('/fetchUsers/:id', async (req, res) => {
     try {
          const id = req.params.id;
          const user = await UsersModel.findById(id);

          if (!user) {
               return res.status(404).json({ error: 'user not found' });
          }
          res.json(user);
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});



router.post('/createUser', async (req, res) => {
     try {
          const data = req.body;
          const user = new UsersModel(data);
          const savedUser = await user.save()
          res.json(savedUser)
     } catch (err) {
          res.json(err)
     }

})


router.delete('/deleteUserById/:id', async (req, res) => {
     try {
          const id = req.params.id;
          const deleted_user = await UsersModel.findByIdAndDelete(id);

          if (!deleted_user) {
               return res.status(404).json({ error: 'user not found' });
          }

          res.status(200).json(deleted_user);

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
          res.status(200).json(updatedUser);

     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});


module.exports = router;