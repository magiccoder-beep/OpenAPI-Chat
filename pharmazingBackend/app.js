const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const db = require('./util/database');
const jwt = require('./helpers/jwt');
const app = express();
const errorHandler = require('./helpers/errorHandler');
const https = require('https');
const fs = require('fs');
const axios = require('axios');

app.use(express.json());
app.use(jwt());
app.use(errorHandler);
const port = process.env.PORT || 3000
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./routes/users'));
app.use('/questions', require('./routes/questions'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/votes', require('./routes/votes'));
app.use('/marketingMessages', require('./routes/marketingMessages'));
app.use('/logs', require('./routes/logs'));
// app.use('/', require('./routes/home'));

//Redirect to apple store or play store based on device
app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    if (/android/i.test(userAgent)) {
      res.redirect('https://play.google.com/store/apps/details?id=com.pharmazingde');
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
    } else {
      res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
    }
});

//Redirect to apple store or play store based on device
app.get('/thiememe83221', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (/android/i.test(userAgent)) {
    res.redirect('https://play.google.com/store/apps/details?id=com.pharmazingde');
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
  } else {
    res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
  }
});

//Redirect to apple store or play store based on device
app.get('/karomedic3381', (req, res) => {
  const userAgent = req.headers['user-agent'];
  if (/android/i.test(userAgent)) {
    res.redirect('https://play.google.com/store/apps/details?id=com.pharmazingde');
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
  } else {
    res.redirect('https://apps.apple.com/de/app/pharmazing-medizin-assistent/id6477707839');
  }
});

// Serve assetlinks.json file
app.get('/.well-known/assetlinks.json', (req, res) => {
    // Set content-type to application/json
    res.type('application/json');
  
    // Send the assetlinks.json content
    res.send(JSON.stringify([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.pharmazingde", // Replace with your actual package name
          sha256_cert_fingerprints: [
            "A5:DA:C7:CE:A5:E3:C5:B2:AA:D0:64:70:6E:69:6B:24:2C:F8:26:9E:33:3C:9C:9E:BE:24:FA:02:DD:04:61:20" // Replace with your actual SHA256 certificate fingerprint
          ]
        }
      }
    ], null, 2)); // The null and 2 arguments format the JSON output for readability
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
    // Set content-type to application/json
    res.type('application/json');
  
    // Send the assetlinks.json content
    res.send(JSON.stringify([
        {
            "applinks": {
              "apps": [],
              "details": [
                {       // "DEVELOPMENT_TEAM.PRODUCT_BUNDLE_IDENTIFIER"
                  "appID": "4N789249WJ.de.pharmazing-app.pharmazing",
                  "paths": [
                    "*"
                  ]
                }
              ]
            }
        }
    ], null, 2)); // The null and 2 arguments format the JSON output for readability
});

const privacyPolicyEN = (req, res, next) => {
    res.sendFile(path.join(__dirname, '/html/PrivacyPolicyEN.html'));
}

const privacyPolicyDE = (req, res, next) => {
  res.sendFile(path.join(__dirname, '/html/PrivacyPolicyDE.html'));
}

const termsConditionsEN = (req, res, next) => {
  res.sendFile(path.join(__dirname, '/html/TermsAndConditionsEN.html'));
}

const termsConditionsDE = (req, res, next) => {
  res.sendFile(path.join(__dirname, '/html/TermsAndConditionsDE.html'));
}

const support = (req, res, next) => {
    res.sendFile(path.join(__dirname, '/html/Support.html'));
}

const deleteAccount = (req, res, next) => {
    res.sendFile(path.join(__dirname, '/html/DeleteAccount.html'));
}

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '/index.html'));
//   });
app.use('/en/privacyPolicy', privacyPolicyEN);
app.use('/de/privacyPolicy', privacyPolicyDE);
app.use('/en/termsConditions', termsConditionsEN);
app.use('/de/termsConditions', termsConditionsDE);
app.use('/termsConditions', termsConditionsDE);
app.use('/privacyPolicy', privacyPolicyDE);
app.use('/support', support);
app.use('/deleteAccount', deleteAccount);

// Define a health check endpoint
app.use('/health', (req, res) => {
  res.status(200).send('OK'); // Respond with a status code of 200 and 'OK'
});


console.log('start listening on port ' + port);
app.listen(port); 
