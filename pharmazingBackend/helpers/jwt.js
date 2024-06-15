const expressJwt = require('express-jwt');

module.exports = jwt;

function jwt() {
    return expressJwt({'secret': process.env.ACCESS_TOKEN_SECRET}).unless({
        path: [
            // public routes that don't require authentication
            '/users/loginEmail', '/users/token', '/users/registerEmail', '/users/sendResetToken', '/health',
            '/addLog', '/users/test', '/users/checkResetPasswordCode', '/users/resetPassword', '/', '/privacyPolicy','/en/privacyPolicy','/de/privacyPolicy',
            '/users/sendVerificationSMS', '/support', '/users/sendNotification', '/deleteAccount', '/users/phonenumberRegistered',
            '/downloadApp', '/.well-known/assetlinks.json', '/.well-known/apple-app-site-association', '/termsConditions','/en/termsConditions', '/de/termsConditions',
            '/karomedic3381', '/thiememe83221'
        ]
    });
}