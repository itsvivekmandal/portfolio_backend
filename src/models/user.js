const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  projects: {type: Array},
  blogs: {type: Array},
  addTime: {type: Date, default: Date.now}
});

// Create user model
const User = mongoose.model('User', userSchema);

// export default module = User;
module.exports = User;