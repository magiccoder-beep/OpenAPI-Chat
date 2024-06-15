const path = require('path');

const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

router.post('/loginEmail', userController.loginEmail);
router.post('/registerEmail', userController.registerEmail);

router.post('/deleteAccount', userController.deleteAccount);
router.get('/test', userController.test);
router.post('/token', userController.generateNewAccessToken);
router.post('/sendResetToken', userController.sendResetToken);
router.post('/resetPassword', userController.resetPassword);
router.post('/checkResetPasswordCode', userController.checkResetPasswordCode);
router.post('/getUsers', userController.getUsers);
router.post('/sendVerificationSMS', userController.sendVerificationSMS);
router.get('/sendNotification', userController.sendNotification);
router.post('/setFcmToken', userController.setFcmToken);
router.post('/phonenumberRegistered', userController.phonenumberRegistered);

router.post('/fetchMessagesQuestion', userController.fetchMessagesQuestion);
router.post('/fetchHistoryQuestions', userController.fetchHistoryQuestions);
router.post('/fetchMessagesHistory', userController.fetchMessagesHistory);
router.post('/fetchMessagesHistoryAdmin', userController.fetchMessagesHistoryAdmin);
router.post('/fetchMessagesHistoryDownvote', userController.fetchMessagesHistoryDownvote);
router.post('/setMarketingData', userController.setMarketingData);
router.post('/setSemester', userController.setSemester);
router.post('/getSemester', userController.getSemester);

module.exports = router;
