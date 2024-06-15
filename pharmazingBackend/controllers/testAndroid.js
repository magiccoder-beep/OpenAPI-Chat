const {google} = require('googleapis');

async function verifyPurchaseAndroid(token, packageName, subscriptionId) {
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
    console.log(response.data);
    // Process the verification response here
  } catch (error) {
    console.error('Error verifying the purchase token', error);
    // Handle errors here
  }
}

async function acknowledgePurchase(token, packageName, subscriptionId) {
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
      console.log(response.data);
      // Process the verification response here
    } catch (error) {
      console.error('Error acknowledging the purchase token', error);
      // Handle errors here
    }
  }

const packageName = 'com.pharmazingde'
const token = 'hfnbdbpofciigbekblgldgbg.AO-J1Oxfw2Tg0RYj98Lxipze8pBu4UREfmjR9SbjwswlBdAkmshgFR-Rq1z9lFAy35iztokvP7_ngZ1aFn2dyzWWNdoC_N-fRw'
const subscriptionId = 'pharmazing_4499_3m'
console.log(token.length)
verifyPurchaseAndroid(token, packageName, subscriptionId)
// acknowledgePurchase(token, packageName, subscriptionId)


module.exports.verifyPurchaseAndroid = verifyPurchaseAndroid;