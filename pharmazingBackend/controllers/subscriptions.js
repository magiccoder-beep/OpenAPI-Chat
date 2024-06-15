const Subscription = require('../models/subscription');
const Subscriptions = require('../db_manipulations/subscriptions');
const LogError = require('../models/error');
const {google} = require('googleapis');
const axios = require('axios');
const jwt = require('jsonwebtoken'); 
const fs = require('fs');
const packageName = 'com.pharmazingde'

async function verifyPurchaseAndroid(subscription_row_id, token, subscriptionId) {
  console.log('verifyPurchaseAndroid')

  const auth = new google.auth.GoogleAuth({
    keyFile: './util/androidgcp.json',
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  const androidPublisher = google.androidpublisher({
    version: 'v3',
    auth,
  });

  try {
    const response = await androidPublisher.purchases.subscriptions.get({
      packageName,
      subscriptionId,
      token,
    });
    const res = response.data;
    let userCancellationTimeMillis = res.userCancellationTimeMillis === undefined ? 0 : parseInt(res.userCancellationTimeMillis);
    let cancelReason = res.cancelReason === undefined ? 0 : res.cancelReason;
    let paymentState = res.paymentState === undefined ? -1 : res.paymentState;
    
    const [rows, fieldData] = await Subscriptions.fetchOnId(subscription_row_id); 
    //If difference between expiration is smaller than 30 secs, its same subs
    if(rows[0].expiryTimeMillis === parseInt(res.expiryTimeMillis) || rows[0].expiryTimeMillis == 0 || (Math.abs(parseInt(res.expiryTimeMillis)-rows[0].expiryTimeMillis)<30000)) {
      Subscriptions.updateSubscriptionAndroid(subscription_row_id, parseInt(res.startTimeMillis), parseInt(res.expiryTimeMillis), userCancellationTimeMillis, res.autoRenewing, res.priceCurrencyCode, parseInt(res.priceAmountMicros), res.countryCode, paymentState, res.purchaseType, res.acknowledgementState, cancelReason)
    } else {
      Subscriptions.updateShouldNotVerify(subscription_row_id); 
      Subscriptions.createSubscriptionAndroid(rows[0].user_id, rows[0].platform, rows[0].productId,rows[0].purchaseToken,rows[0].orderId, parseInt(res.startTimeMillis), parseInt(res.expiryTimeMillis), userCancellationTimeMillis, res.autoRenewing, res.priceCurrencyCode, parseInt(res.priceAmountMicros), res.countryCode, paymentState, res.purchaseType, res.acknowledgementState, cancelReason)
    }
    return { success: true, expiryTimeMillis: parseInt(res.expiryTimeMillis)}
    
    // Process the verification response here
  } catch (error) {
    console.error('Error verifying the purchase token', error);
    return { success: false }
    // Handle errors here
  }
}

async function acknowledgePurchase(token, subscriptionId) {
    const auth = new google.auth.GoogleAuth({
      keyFile: './util/androidgcp.json',
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
  
    const androidPublisher = google.androidpublisher({
      version: 'v3',
      auth,
    });
  
    try {
      const response = await androidPublisher.purchases.subscriptions.acknowledge({
        packageName,
        subscriptionId,
        token,
        requestBody: {}
      });
      // Process the verification response here
    } catch (error) {
      console.error('Error acknowledging the purchase token', error);
      // Handle errors here
    }
  }



exports.acknowledgePurchaseAndroid = async (req, res, next) => {
    const subscription = new Subscription(-1, req.user.user_id, req.body.platform, req.body.productId, req.body.acknowledgementState, req.body.purchaseToken, req.body.orderId, "");
    subscription
    .save()
    .then(([rows, fieldData]) => {
        acknowledgePurchase(req.body.purchaseToken, req.body.productId).then(() => {
            verifyPurchaseAndroid(rows.insertId, req.body.purchaseToken, req.body.productId).then((res) => {
                res.status(200).json({
                    success: 1
                });
            }).catch((err) => {
              res.status(200).json({
                  success: 0
              });
          })

        }).catch((err) => {
            res.status(200).json({
                success: 0
            });
        })
    })
    .catch(function(error) {
        const myError = new LogError(error.message, 'subscription:', req.user.user_id, -1, req.body.answer_id);
        myError
        .save();
        res.status(200).json({
            success: 0, 
            error: 3,
            errorMsg: 'An error occured while saving subscription'
        });
    });
}

// acknowledgePurchaseIOS = async (productId, transactionDate, transactionReceipt, transactionId

// subscription_id, startTimeMillis, originalPurchaseMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, acknowledgementState

BUNDLE_ID = 'de.pharmazing-app.pharmazing'
ISSUER_ID = 'd9fc1d5e-991c-4f78-84f1-e172c684f9fa'
KEY_ID = 'C8D7DH7N84'

const issueTime = Math.floor(Date.now() / 1000);
const expirationTime = issueTime + 60 * 60; // 1 hour expiration

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

async function verifyPurchaseIOS(subscription_id, transactionId, productId) {
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
              let signedRenewalInfo = response.data.data[i].lastTransactions[0].signedRenewalInfo;
              const decodedRenewal = jwt.decode(signedRenewalInfo, { complete: true }).payload;
              // const acknowledged = transaction.inAppOwnershipType==='PURCHASED' ? 1 : 0;

              const [rows, fieldData] = await Subscriptions.fetchOnId(subscription_id); 
              if(rows[0].expiryTimeMillis === parseInt(decoded.expiresDate) || rows[0].expiryTimeMillis == 0) {
                Subscriptions.updateSubscriptionIOS(subscription_id, parseInt(decoded.purchaseDate), parseInt(decoded.originalPurchaseDate), parseInt(decoded.expiresDate), 0, decodedRenewal.autoRenewStatus, 1, parseInt(decoded.price)*1000, decoded.currency, decoded.storefront, parseInt(decoded.signedDate), parseInt(response.data.data[i].lastTransactions[0].status))
              } else {
                Subscriptions.updateShouldNotVerify(subscription_id); 
                Subscriptions.createSubscriptionIOS(rows[0].user_id, rows[0].platform, rows[0].productId,rows[0].orderId, parseInt(decoded.purchaseDate), parseInt(decoded.originalPurchaseDate), parseInt(decoded.expiresDate), decodedRenewal.autoRenewStatus, decoded.currency, parseInt(decoded.price)*1000, decoded.storefront, parseInt(decoded.signedDate), parseInt(response.data.data[i].lastTransactions[0].status))
              }

              return { success: true, expiryTimeMillis: parseInt(decoded.expiresDate)}
              //return {found: true, transaction: decoded, renewal: decodedRenewal.autoRenewStatus, status: response.data.data[i].lastTransactions[0].status};
          }
      }
      return { success: false};
  } catch (error) {
      console.error('Error in verifyPurchaseIOS:', error);
      return { found: false, error: error.message };
  }
}

exports.acknowledgePurchaseIOS = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const platform = req.body.platform;
    const productId = req.body.productId;
    const transactionId = req.body.transactionId;

    const subscription = new Subscription(-1, userId, platform, productId, 0, "", transactionId);
    const [rows, fieldData] = await subscription.save();

    try {
        await verifyPurchaseIOS(rows.insertId, transactionId, productId);

        // if(result.found) {
        //     const transaction = result.transaction;
        //     // const acknowledged = transaction.inAppOwnershipType==='PURCHASED' ? 1 : 0;
        //     Subscriptions.updateSubscriptionIOS(rows.insertId, parseInt(transaction.purchaseDate), parseInt(transaction.originalPurchaseDate), parseInt(transaction.expiresDate), 0, result.renewal, 1, parseInt(transaction.price)*1000, transaction.currency, transaction.storefront, parseInt(transaction.signedDate), parseInt(result.status))
        // } else {
        //     const myError = new LogError('IOS transaction not found', 'subscription transaction not found:'+transactionId, userId, -1, -1);
        //     await myError.save();
        // }
        res.status(200).json({
            success: 1
        });
    } catch (err) {
        console.log(err)
        res.status(200).json({
            success: 0
        });
    }
  } catch (error) {
      const myError = new LogError(error.message, 'subscription:', req.user.user_id, -1, -1);
      await myError.save();
      res.status(200).json({
          success: 0,
          error: 3,
          errorMsg: 'An error occurred while saving subscription'
      });
  }
}

// exports.acknowledgePurchaseIOS = async (req, res, next) => {
//   console.log(req.body.transactionReceipt)
//   console.log(req.body.productId)
//   console.log(req.body.transactionDate)
//   console.log(req.body.transactionId)
//     const sandboxUrl = 'https://sandbox.itunes.apple.com/verifyReceipt'
//     let requestBody =
//     {
//       "receipt-data": req.body.transactionReceipt,
//       "password": "03f1df7578f4481d954e58194b45064e",
//       "exclude-old-transactions": true // Optional
//     }

//     try {
//       const response = await axios.post(sandboxUrl, requestBody);
//       console.log('Receipt verification response:', response.data);
//       // Process the response.data as needed
//     } catch (error) {
//       console.error('Error verifying receipt:', error.response ? error.response.data : error.message);
//     }

//     res.status(200).json({
//         success: 1
//     });
//   // console.log(req.body)
//     const subscription = new Subscription(-1, req.user.user_id, req.body.platform, req.body.productId, 0, "", req.body.transactionId, req.body.transactionReceipt);
//     subscription
//     .save()
//     .then(([rows, fieldData]) => {
//         acknowledgePurchase(req.body.purchaseToken, packageName, req.body.productId).then(() => {
//             verifyPurchaseAndroid(rows.insertId, req.body.purchaseToken, packageName, req.body.productId).then((res) => {
//                 res.status(200).json({
//                     success: 1
//                 });
//             }).catch((err) => {
//               res.status(200).json({
//                   success: 0
//               });
//           })

//         }).catch((err) => {
//             res.status(200).json({
//                 success: 0
//             });
//         })
//     })
//     .catch(function(error) {
//         const myError = new LogError(error.message, 'subscription:', req.user.user_id, -1, req.body.answer_id);
//         myError
//         .save();
//         res.status(200).json({
//             success: 0, 
//             error: 3,
//             errorMsg: 'An error occured while saving subscription'
//         });
//     });
// }


module.exports.verifyPurchaseAndroid = verifyPurchaseAndroid;
module.exports.verifyPurchaseIOS = verifyPurchaseIOS;
