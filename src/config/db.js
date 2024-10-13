const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {setConnectionStatus} = require('../middleware/dbConnectionCheck');

const connectDB = async() => {
  const username = process.env.MONGO_USER_NAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD); // encodeURIComponent are used to handle the special characters
  const db = process.env.MONGO_DB_NAME;
  const mongoURI = `mongodb+srv://${username}:${password}@cluster0.l5mrq1k.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;

  mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Connected');
    setConnectionStatus(true);
  })
  .catch(error => {
    console.error(`Error connecting to MongoDB ${error}`);
    setConnectionStatus(false);
  })

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    setConnectionStatus(false); // Mark the connection as not available
  });
};

module.exports = connectDB;