

  const express = require('express');
const { profileSave } = require('../controllers/profileController');
const router = express.Router();

router.post('/save', profileSave);




module.exports = router;
