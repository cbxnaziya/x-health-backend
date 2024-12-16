const express = require('express');
const { updateLanguage } = require('../controllers/languageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/update', authMiddleware, updateLanguage); // Protected route

module.exports = router;
