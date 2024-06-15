const path = require('path');

const express = require('express');

const questionController = require('../controllers/questions');

const router = express.Router();

router.post('/askQuestion', questionController.askQuestion);
router.post('/getQuestions', questionController.getQuestions);

module.exports = router;
