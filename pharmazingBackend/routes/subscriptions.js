const path = require('path');

const express = require('express');

const subscriptionController = require('../controllers/subscriptions');

const router = express.Router();

router.post('/acknowledgePurchaseAndroid', subscriptionController.acknowledgePurchaseAndroid);
router.post('/acknowledgePurchaseIOS', subscriptionController.acknowledgePurchaseIOS);

module.exports = router;