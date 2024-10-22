require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SECRETE_KEY = process.env.SECRETE_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

/**
 * This function used to signup the user
 * @return It will return a boolean value
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const signUp = async(request, response) => {
  const {name, email, password} = request.body;

  //Validate fields
  if(name === undefined || name === null || name === '') {
    return response.status(400).json({error: 'Invalid username'});
  } else if(password === undefined || password === null || password === '') {
    return response.status(400).json({error: 'Invalid password'});
  } else if (email === undefined || email === null || email === '') {
    return response.status(400).json({error: 'Invalid email id'});
  }

  // Check is user already exist
  const userExist = await User.findOne({'email': email});
  if(userExist) return response.status(400).json({error: 'User already exist!'});

  try {
    hashPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashPassword });
    await user.save();
    return response.json({"status": user});
  } catch (error) {
    return response.status(500).json({error: error.message });
  }

};

/**
 * This function used to login user
 * @return It will return an object or false on fail
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const login = async(request, response) => {
  const {username, password} = request.body;

  if(username === undefined || username === null || username === '') {
    return response.status(400).json({error: 'Please enter username'});
  } else if (username === undefined || username === null || username === '') {
    return response.status(400).json({error: 'Please enter password'});
  }

  // Check for user
  const user = await User.findOne({'email': username});
  if(!user) return response.status(400).json({error: 'User not found'});

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return response.status(401).json({error: 'Invalid password'});

  // Create token
  const userDetails = {id: user.id, name: user.name, email: user.email};
  const accessToken = jwt.sign(userDetails, SECRETE_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
  const refreshToken = jwt.sign(userDetails, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN});

  return response.json({accessToken: accessToken, refreshToken: refreshToken});
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
 * @return It will return a boolean value
 * @author Vivek Mandal <vivek248.vm@gmail.com>
 */
const sendMail = async(request, response) => {
  const {message} = request.body;
  if(message === '' || message === undefined || message === null) {
    return response.status(400).json({message: 'Empty message!'});
  }

  sgMail
  .send({
    to: 'itsvivekmandal@gmail.com',
    from: 'Vivek Mandal<vivek248.vm@gmail.com>',
    subject: 'Portfolio Mail',
    text: message,
  })
  .then(() => {
    return response.json({message: "Mail sent successfully."});
  })
  .catch((error) => {
    return response.status(400).json({message: `Failed to send mail- ${error}`});
  });

};

module.exports = {signUp, login, portfolioData, sendMail};


