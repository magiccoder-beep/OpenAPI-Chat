const path = require('path');

const express = require('express');

const marketingMessageController = require('../controllers/marketingMessages');

const router = express.Router();

router.post('/getNextMarketingMessage', marketingMessageController.getNextMarketingMessage);
router.post('/markAsDelivered', marketingMessageController.markAsDelivered);
router.post('/markAsClicked', marketingMessageController.markAsClicked);
router.post('/sendPriceProposal', marketingMessageController.sendPriceProposal);
router.post('/sendNoInterest', marketingMessageController.sendNoInterest);

router.post('/test', marketingMessageController.test);

module.exports = router;
