const progress = require('../controllers/progress');

const portfolioDetails = async(req, res) => {

  let progressInfo = await progress();
  
  res.json({message: progressInfo});
};


module.exports = portfolioDetails;