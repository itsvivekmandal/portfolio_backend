require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRETE_KEY = process.env.SECRETE_KEY;

const auth = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  if(!token) return res.status(401).json({error: 'Acess Denied. No token provided!'});

  jwt.verify(token, SECRETE_KEY, (err, user) => {
    if(err) return res.status(401).json({error: 'Invalid Token!'});

    req.user = user;

    next();
  });
};

module.exports = auth;