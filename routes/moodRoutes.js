const express = require('express');
const { saveMood } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/save', authMiddleware, saveMood); // Protected route

module.exports = router;
