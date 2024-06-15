const jwt = require('jsonwebtoken'); // npm install jsonwebtoken
const fs = require('fs');
// const { promisify } = require('util');
const crypto = require('crypto');
const axios = require('axios');
BUNDLE_ID = 'de.pharmazing-app.pharmazing'
ISSUER_ID = 'd9fc1d5e-991c-4f78-84f1-e172c684f9fa'
KEY_ID = 'C8D7DH7N84'

const issueTime = Math.floor(Date.now() / 1000);
const expirationTime = issueTime + 60 * 60; // 1 hour expiration
console.log('issueTime')
console.log(issueTime)
console.log(expirationTime)
header = {
    'alg': 'ES256',
    'kid': KEY_ID,
    'typ': 'JWT'
}
   
payload = {
    'iss': ISSUER_ID,
    'iat': issueTime,
    'exp': expirationTime,
    'aud': 'appstoreconnect-v1',
    'bid': BUNDLE_ID
}

// Function to sign the JWT with ES256
async function signJwt(header, payload, privateKey) {}

const Subscription = require('../models/subscription');
const Subscriptions = require('../db_manipulations/subscriptions');
const LogError = require('../models/error');

async function verifyPurchaseIOS(transactionId, productId) {
    try {
        const PRIVATE_KEY = fs.readFileSync('controllers/subkey.p8');
        const tokenEncoded = jwt.sign(payload, PRIVATE_KEY, {
            algorithm: 'ES256',
            header: header
        });
        const authorizationHeader = `Bearer ${tokenEncoded}`;

        const config = {
            method: 'get',
            // url: `https://api.storekit-sandbox.itunes.apple.com/inApps/v1/history/${transactionId}`,
            url: `https://api.storekit-sandbox.itunes.apple.com/inApps/v1/subscriptions/${transactionId}`,
            headers: { 
                'Authorization': authorizationHeader
            }
        };

        const response = await axios(config);
        for(let i = 0; i < response.data.data.length; i++) {
            let signedTransactionInfo = response.data.data[i].lastTransactions[0].signedTransactionInfo;
            const decoded = jwt.decode(signedTransactionInfo, { complete: true }).payload;

            if(productId === decoded.productId) {
                console.log(response.data.data[i])
                let signedRenewalInfo = response.data.data[i].lastTransactions[0].signedRenewalInfo;
                const decodedRenewal = jwt.decode(signedRenewalInfo, { complete: true }).payload;
                // console.log(decodedRenewal)
                return {found: true, transaction: decoded, renewal: decodedRenewal.autoRenewStatus, status: response.data.data[i].lastTransactions[0].status};
            }
        }
        return { found: false};
    } catch (error) {
        console.error('Error in verifyPurchaseIOS:', error);
        return { found: false, error: error.message };
    }
}


(async () => {
    const productId = 'pharm_999_10m';
    const transactionId = '2000000553784180';
    const userId = 5;
    const platform = 'ios';
    try {
        const subscription = new Subscription(-1, userId, platform, productId, 0, "", transactionId);
        
        // Assuming save() is an async operation
        const [rows, fieldData] = await subscription.save();
        console.log(rows)

        try {
            // Assuming verifyPurchaseIOS is an async function
            const result = await verifyPurchaseIOS(transactionId, productId);
            console.log(result)
            if(result.found) {
                const transaction = result.transaction;
                const acknowledged = transaction.inAppOwnershipType==='PURCHASED' ? 1 : 0;
                Subscriptions.updateSubscriptionIOS(rows.insertId, parseInt(transaction.purchaseDate), parseInt(transaction.originalPurchaseDate), parseInt(transaction.expiresDate), 0, result.renewal, acknowledged, parseInt(transaction.price)*1000, transaction.currency, transaction.storefront, parseInt(transaction.signedDate), parseInt(result.status))
            } else {
                const myError = new LogError('IOS transaction not found', 'subscription transaction not found:'+transactionId, userId, -1, -1);
                await myError.save();
            }
            // res.status(200).json({
            //     success: 1
            // });
        } catch (err) {
            console.log(err)
            // Handle verification error
            // res.status(200).json({
            //     success: 0
            // });
        }

    } catch (error) {
        // Handle error from subscription saving
        const myError = new LogError(error.message, 'subscription:', userId, -1, -1);
        await myError.save();
        // res.status(200).json({
        //     success: 0,
        //     error: 3,
        //     errorMsg: 'An error occurred while saving subscription'
        // });
    }
})();
