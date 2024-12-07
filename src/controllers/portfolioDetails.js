const progress = require('../controllers/progress');

const portfolioDetails = async(req, res) => {

  let progressInfo = await progress();
  
  res.json({progressInfo: progressInfo});
};


module.exports = portfolioDetails;