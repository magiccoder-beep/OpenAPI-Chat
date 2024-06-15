const path = require('path');

const express = require('express');

const questionController = require('../controllers/questions');

const router = express.Router();

router.get('/', questionController.home);

module.exports = router;
