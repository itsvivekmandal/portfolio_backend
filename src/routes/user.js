const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Route to create a new user
router.post('/save', async(req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to fetch details of all the users
router.get('/users', async(req, res) => {
  try {
    const usersDetail = await User.find();
    res.send(usersDetail);
    // res.send('test');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
// export default module = router;