const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// GET route to fetch all users (protected for admins)
router.get('/',authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
