

  const express = require('express');
const { profileSave, updateProfile } = require('../controllers/profileController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save',authMiddleware, profileSave);
router.put('/update',authMiddleware, updateProfile);




module.exports = router;
