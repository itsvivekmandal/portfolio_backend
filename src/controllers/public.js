const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * This function used to signup the user
 * @return It will return boolean value
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const signUp = async(request, response) => {
  const {name, email, password} = request.body;

  //Validate fields
  if(name === undefined || name === null || name === '') {
    return response.status(400).json({'error': 'Invalid username'});
  } else if(password === undefined || password === null || password === '') {
    return response.status(400).json({'error': 'Invalid password'});
  } else if (email === undefined || email === null || email === '') {
    return response.status(400).json({'error': 'Invalid email id'});
  }

  // Check is user already exist
  const userExist = await User.findOne({'email': email});
  if(userExist) return response.status(400).json({'error': 'User already exist!'});

  try {
    hashPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashPassword });
    await user.save();
    return response.json({"status": user});
  } catch (error) {
    return response.status(500).json({ "error": error.message });
  }

};

/**
 * This function used to login user
 * @return It will return an object or false on fail
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const login = async(request, response) => {
  response.json({"message": "login invoked!"});
};

/**
 * This function used to fetch the data of portfolio website
 * @return It will return an object
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const portfolioData = async(request, response) => {
  response.json({"message": "portfolio invoked!"});
};

/**
 * This function used to send the mail
 * @return It will a boolean value
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const sendMail = async(request, response) => {
  response.json({"message": "mail sent!"});
};

module.exports = {signUp, login, portfolioData, sendMail};


