const path = require('path');

const express = require('express');

const logController = require('../controllers/logs');

const router = express.Router();

router.post('/addLog', logController.addLog);

module.exports = router;
