const express = require('express');
const {signUp, login, portfolioData, sendMail} = require('../controllers/public');

const router = express.Router();

// Route to create a new user
router.post('/signup', signUp);
// Route to create a new user
router.post('/login', login);
// Route to fetch details of all the users
router.get('/portfolio', portfolioData);
// Route to send mail
router.get('/send', sendMail);

// export the router
module.exports = router;
