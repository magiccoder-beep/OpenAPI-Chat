const path = require('path');

const express = require('express');

const voteController = require('../controllers/votes');

const router = express.Router();

router.post('/vote', voteController.vote);

module.exports = router;
