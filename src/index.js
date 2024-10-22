// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const publicRoutes = require('../src/routes/publicRoutes');
const privateRoutes = require('../src/routes/privateRoutes');
const connectDB = require('../src/config/db');
const {checkDBConnection} = require('../src/middleware/dbConnectionCheck');
const auth = require('../src/middleware/auth');
const cors = require('cors');

// Configure the env file
dotenv.config();
// Initialize Express app
const app = express();
const port = process.env.PORT || 9000;
app.use(cors());
// Middleware to parse incoming JSON
app.use(express.json());

// MongoDB connection
connectDB();

// Use the connection check middleware globally
app.use(checkDBConnection);

// Route handling (after ensuring the database is connected)
app.use('/', publicRoutes);
app.use('/blog', auth, privateRoutes);


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });


app.listen(port, () => {
  console.log(`Portfolio server listening on port ${port}`);
});