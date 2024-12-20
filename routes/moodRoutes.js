const express = require('express');
const { saveMood } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, saveMood); // Protected route
router.post('/save', authMiddleware, saveMood); // Protected route
router.put('/update', authMiddleware, saveMood); // Protected route
router.delete('/delete', authMiddleware, saveMood); // Protected route

module.exports = router;
