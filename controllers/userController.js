const User = require('../models/User'); // Assuming you have a User model

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Example: Fetch all users from the database
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getAllUsers };
