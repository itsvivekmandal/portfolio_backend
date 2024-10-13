// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('../src/routes/user');
const connectDB = require('../src/config/db');
const {checkDBConnection} = require('../src/middleware/dbConnectionCheck');
// Configure the env file
dotenv.config();
// Initialize Express app
const app = express();
const port = process.env.PORT || 9000;

// Middleware to parse incoming JSON
app.use(express.json());

// MongoDB connection
connectDB();

// Use the connection check middleware globally
app.use(checkDBConnection);

// Route handling (after ensuring the database is connected)
app.use('/portfolio', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Portfolio server listening on port ${port}`);
});