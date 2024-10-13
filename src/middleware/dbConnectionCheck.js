let isConnected = false;

// Function to set the connetion status
const setConnectionStatus = (status) => {
  isConnected = status;
};

// Check DB Connection
const checkDBConnection = (req, res, next) => {
  if(!isConnected) {
    return res.status(503).send({error: 'Service Unavailable. Database not connected.' });
  }
  next(); // Proceed to the next middleware or routes handler
};

module.exports = { setConnectionStatus, checkDBConnection};