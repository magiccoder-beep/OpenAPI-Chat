const path = require('path');

const db = require('../util/database');
const User = require('../models/user');
const ConsumedTrial = require('../models/consumedTrial');
const Phone = require('../models/phone');
const LogError = require('../models/error');
const FcmToken = require('../models/fcmToken');
const Login = require('../models/login');
const Questions = require('../db_manipulations/questions');
// const DeviceInfo = require('../models/deviceInfo');
const Users = require('../db_manipulations/users');
const Messages = require('../db_manipulations/messages');
const ConsumedTrials = require('../db_manipulations/consumedTrials');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const https = require('https');
const request = require('request');
const handleEmails = require('../general/email');
const Subscriptions = require('../db_manipulations/subscriptions');

const phonenumberSender = '+1 659 277 2220';

var admin = require("firebase-admin");
var serviceAccount = require("../util/notifications.json");
// CONSTANTS
// Change these values to few minutes for testing
// const TRIAL_DURATION_MS = 3 * 60 * 1000;
const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const START_PAYWALL_MS = 90 * 24 * 60 * 60 * 1000;

//NB days after you can change device, NB_DAYS and POSSIBLE_DEVICE_CHANGE_AFTER_MS, should actually be same, but different for testing
const NB_DAYS = 30;
const POSSIBLE_DEVICE_CHANGE_AFTER_MS = 0.15* 60 * 1000;

exports.sendNotification = (req, res, next) => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    var message = {
        notification: {
          title: 'Testing',
          body: 'Just trying out the notifications'
        },
        token: 'cSlJ52ZEMUSOl1qWvPEb8F:APA91bGizsIqZCn_RsGSS_wSu9bzjQJ5_MD7klDPJ9SaZhlu7tOzNRTyK4MXz_XzsIKRVaYTkuOWDk2k3nnApFOhWaP2KHfpMedJb21ecGl2PYH8B9grXxPAqSAKSxSwgWqKxDTkazbo'
      };
      
      admin.messaging().send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            const myError = new LogError(error.message, 'Error sending notification', -1, -1, -1);
            myError
            .save()
          console.log('Error sending message:', error);
        });

    res.status(200).json({
        success: 1
    });
}

var nodemailer = require('nodemailer');
exports.test = async (req, res, next) => {
    console.log('test and about to send test email')

    try {
        await handleEmails.sendConfirmationEmail();

        res.send(`
        <html>
            <head>
                <title>Email Confirmation</title>
            </head>
            <body>
                <h1>Your email is confirmed</h1>
            </body>
        </html>
    `);
        // res.status(200).json({
        //     success: 1
        // });
    } catch (error) {
        res.send(`
        <html>
            <head>
                <title>Email Confirmation</title>
            </head>
            <body>
                <h1>Something went wrong</h1>
            </body>
        </html>
    `);
        // res.status(500).json({
        //     success: 0, 
        //     error: error.message
        // });
    }
}

exports.setFcmToken = (req, res, next) => {
    const userId = req.user.user_id;
    const fcmToken = req.body.token;
    let is_tablet = req.body.is_tablet;
    let platform = req.body.platform;
    let device_id = req.body.device_id;
    
    try {
        is_tablet = is_tablet === undefined ? 2 : is_tablet;
        platform = platform === undefined ? "unknown" : platform;
        device_id = device_id === undefined ? "" : device_id;

        const myFcmToken = new FcmToken(userId, platform, fcmToken, is_tablet, device_id);
        myFcmToken.save();

        Users.setFcmToken(userId, fcmToken);
        res.status(200).json({
            success: 1
        });
    } catch (error) {
        const myError = new LogError(error.message, 'Error setting fcm token', userId, -1, -1);
        myError
        .save()
        // console.error("Error deleting account: ", error);
        res.status(200).json({
            success: 0
        });
    }
}

exports.getSemester = async (req, res, next) => {
    const userId = req.user.user_id;

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        let semester = rows[0].semester
        // if they are not studying then just return non empty string so they wont be asked for their semester
        // if(rows[0].occupation == 'BE') {
        //     semester = 'NA'
        // }
        if(rows.length>0) {
            res.status(200).json({
                success: 1,
                semester:rows[0].semester,
                occupation: rows[0].occupation
            });
        } else {
            res.status(200).json({
                success: 0
            });
        }
    } catch (error) {
        const myError = new LogError(error.message, 'Error getting semester userid', userId, -1, -1);
        myError
        .save()
        res.status(200).json({
            success: 0
        });
    }
}

exports.setSemester = async (req, res, next) => {
    try {
        const [rows, fieldData] = await Users.setSemester(req.user.user_id, req.body.semester)
        res.status(200).json({
            success: 1
        });
    } catch (error) {
        const myError = new LogError(error.message, 'setSemester: error user id '+req.user.user_id + ' ' + req.body.semester, -1, -1, -1);
        myError
        .save();
        res.status(200).json({
            success: 0
        });
    }
}


exports.deleteAccount = async (req, res, next) => {
    const userId = req.user.user_id;

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rows.length>0) {
            let consumed_millis = 0;
            let currentDate = Date.now()

            let previous_consumed_millis = 0;
            const [rows2] = await ConsumedTrials.fetchOnPhonenumber(rows[0].phonenumber);
            if(rows2.length>0) {
                previous_consumed_millis = rows2[0].consumed_millis;
            }

            // You used up all trial period
            if(currentDate>rows[0].trial_end_date_epoch) {
                consumed_millis = TRIAL_DURATION_MS - previous_consumed_millis
            // You used up some of trial period
            } else if(rows[0].trial_end_date_epoch-currentDate<TRIAL_DURATION_MS-previous_consumed_millis) {
                consumed_millis = (TRIAL_DURATION_MS-previous_consumed_millis)-(rows[0].trial_end_date_epoch-currentDate);
            }

            if(consumed_millis > 0) {
                const myConsumedTrial = new ConsumedTrial(rows[0].phonenumber, consumed_millis)
                myConsumedTrial.save()
            }

            Users.deleteUser(userId);
            res.status(200).json({
                success: 1
            });
        } else {
            res.status(200).json({
                success: 1
            });
        }
    } catch (error) {
        const myError = new LogError(error.message, 'Error deleting account', userId, -1, -1);
        myError
        .save()
        // console.error("Error deleting account: ", error);
        res.status(200).json({
            success: 0
        });
    }
}

exports.marketingInfo = async (req, res, next) => {
    console.log('marketingInfo')

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rows.length>0) {
            if(rows[0].admin) {
                const [rows, fieldData] = await Users.marketing();

                res.status(200).json({
                    success: 1,
                    users: rows
                });
            } else {
                throw Error();
            }
        } else {
            throw Error();
        }
    } catch (error) {
        const myError = new LogError(error.message, 'getUsers', -1, -1, -1);
        myError
        .save();
        console.error("Cannot get users ", error);
        res.status(200).json({
            success: 0
        });
    }  
}

exports.generateNewAccessToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken
    if(refreshToken == null) return res.sendStatus(401);
    //add check to see if it is valid refreshtoken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = createAccessToken(user.user_id);
        res.json({ accessToken: accessToken });
    });
}


const createAccessToken = (userId) => {
    return jwt.sign({user_id: userId, refresh: 0}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '900s'});
}

const createRefreshToken = (userId) => {
    return jwt.sign({user_id: userId}, process.env.REFRESH_TOKEN_SECRET);
}

const validateEmail = (email) =>  {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.fetchHistoryQuestions = async (req, res, next) => {
    try {
        console.log('fetchHistoryQuestions')
        const [rowsUser, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rowsUser.length>0) {
            Messages.fetchHistoryQuestions(req.user.user_id)
            .then(([rows, fieldData]) => {
                res.status(200).json({
                    success: 1, 
                    messages: rows
                });
            })
            .catch(function(error) {
                const myError = new LogError(error.message, 'Error fetchHistoryQuestions', -1, -1, -1);
                myError
                .save()
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured'
                });
            });
        } else {
            res.status(200).json({
                success: 0, 
                error: 2,
                error_code: 'ERROR_OCCURED',
                errorMsg: 'An error occured'
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching on id:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }
}

exports.fetchMessagesQuestion = async (req, res, next) => {
    try {
        const [rowsUser, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rowsUser.length>0) {
            Messages.fetchMessagesQuestion(req.body.question_id)
            .then(([rows, fieldData]) => {
                res.status(200).json({
                    success: 1, 
                    messages: rows
                });
            })
            .catch(function(error) {
                const myError = new LogError(error.message, 'Error fetchMessagesQuestion', req.body.question_id, -1, -1);
                myError
                .save()
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured'
                });
            });
        } else {
            res.status(200).json({
                success: 0, 
                error: 2,
                error_code: 'ERROR_OCCURED',
                errorMsg: 'An error occured'
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching on id:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }
}

exports.fetchMessagesHistory = async (req, res, next) => {

    try {
        const [rowsUser, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rowsUser.length>0) {
            Messages.fetchMessagesHistory(req.user.user_id)
            .then(([rows, fieldData]) => {
                res.status(200).json({
                    success: 1, 
                    messages: rows
                });
            })
            .catch(function(error) {
                const myError = new LogError(error.message, 'Error fetchMessagesHistory', -1, -1, -1);
                myError
                .save()
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured'
                });
            });
        } else {
            res.status(200).json({
                success: 0, 
                error: 2,
                error_code: 'ERROR_OCCURED',
                errorMsg: 'An error occured'
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching on id:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }
}

exports.fetchMessagesHistoryAdmin = async (req, res, next) => {
    try {
        const [rowsUser, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rowsUser.length>0) {
            if(rowsUser[0].admin) {
                Messages.fetchMessagesHistoryAdmin()
                .then(([messages, fieldData]) => {
                    res.status(200).json({
                        success: 1,
                        messages: messages
                    });
                })
                .catch(function(error) {
                    const myError = new LogError(error.message, 'Error fetching fetchMessagesHistoryAdmin', -1, -1, -1);
                    myError
                    .save()
                    res.status(200).json({
                        success: 0, 
                        error: 2,
                        error_code: 'ERROR_OCCURED',
                        errorMsg: 'An error occured'
                    });
                });
            } else {
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured'
                });
            }
        } else {
            res.status(200).json({
                success: 0, 
                error: 2,
                error_code: 'ERROR_OCCURED',
                errorMsg: 'An error occured'
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching on id:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }

}

exports.fetchMessagesHistoryDownvote = async (req, res, next) => {
    try {
        const [rowsUser, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rowsUser.length>0) {
            if(rowsUser[0].admin) {
                Messages.fetchMessagesHistoryDownvote()
                .then(([messages, fieldData]) => {
                    res.status(200).json({
                        success: 1,
                        messages: messages
                    });
                })
                .catch(function(error) {
                    const myError = new LogError(error.message, 'Error fetching fetchMessagesHistoryDownvote', -1, -1, -1);
                    myError
                    .save()
                    res.status(200).json({
                        success: 0, 
                        error: 2,
                        error_code: 'ERROR_OCCURED',
                        errorMsg: 'An error occured'
                    });
                });
            } else {
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured'
                });
            }
        } else {
            res.status(200).json({
                success: 0, 
                error: 2,
                error_code: 'ERROR_OCCURED',
                errorMsg: 'An error occured'
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching on id:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }

}

exports.registerEmail = async (req, res, next) => {
    console.log('registerEmail')
    const email = req.body.email;
    const password = req.body.password;
    const phonenumber = req.body.phonenumber;
    const name = req.body.name;
    const surname = req.body.surname;
    const city = "";
    const university = req.body.university;
    const studies = req.body.studies;
    // const trial = req.body.trial;
    const trial = true;
    const country = req.body.country;
    const country_device = req.body.country_device;
    const device_id = req.body.device_id;
    let occupation = req.body.occupation;
    let is_tablet = req.body.is_tablet;
    let platform = req.body.platform;
    let affiliate_code = req.body.affiliate_code;
    affiliate_code = affiliate_code === undefined ? '' : affiliate_code;
    let semester = req.body.semester;
    semester = semester === undefined ? '' : semester;
    // let passwordEncrypted = bcrypt.hashSync(password, 10);

    // let trialEndDate = new Date(new Date().toISOString().slice(0, 19).replace('T', ' '))
    // trialEndDate = new Date(trialEndDate.getTime() + 5 * 60000);
    
    let consumed_millis = 0;
    const [rows] = await ConsumedTrials.fetchOnPhonenumber(phonenumber);
    if(rows.length>0) {
        consumed_millis = rows[0].consumed_millis;
    }
    
    // let startDatePaywall = new Date(Date.now()).getTime() + 5 * 60 * 1000
    let startDatePaywall = new Date(Date.now()).getTime() + START_PAYWALL_MS;
    let startDateFreeTrial = startDatePaywall - TRIAL_DURATION_MS;
    startDatePaywall = startDatePaywall - consumed_millis;
    // let startDateFreeTrial = new Date(Date.now()).getTime() - TRIAL_DURATION_MS;
    
    let trialEndDate = new Date(startDatePaywall).toISOString().slice(0, 19).replace('T', ' ');


    is_tablet = is_tablet === undefined ? 2 : is_tablet;
    platform = platform === undefined ? "unknown" : platform;
    occupation = occupation === undefined ? 'NONE' : occupation;
    if(validateEmail(email)) {
        if(password.length >= 1) {
            const myUser = new User(-1, email, semester, affiliate_code, password, occupation, true, false, platform, phonenumber, name, surname, city, university, studies, country, country_device, device_id, trial, startDateFreeTrial, trialEndDate, startDatePaywall, false, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), is_tablet);
            Users
            .fetchOnEmail(email)
            .then(([rows, fieldData]) => {
                if(rows.length > 0) {
                    res.status(200).json({
                        success: 0, 
                        error: 2,
                        error_code: 'EMAIL_TAKEN',
                        errorMsg: 'The email address is already taken'
                    });
                } else {
                    myUser
                    .save()
                    .then(([rows, fieldData]) => {
                        const user_id = rows.insertId;
                        const myLogin = new Login(user_id, device_id, platform, is_tablet);
                        myLogin.save()
                        const accessToken = createAccessToken(user_id);
                        const refreshToken = createRefreshToken(user_id);
                        sendMailerLite(email)
                        res.status(200).json({
                            success: 1,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            startDateFreeTrial: startDateFreeTrial,
                            startDatePaywall: startDatePaywall
                        });
                    })
                    .catch(function(error) {
                        console.log(error)
                        const myError = new LogError(error.message, 'Error saving user 1', -1, -1, -1);
                        myError
                        .save()
                        res.status(200).json({
                            success: 0, 
                            error: 3,
                            error_code: 'ERROR_OCCURED',
                            errorMsg: 'An error occured while creating your account!'
                        });
                    });
                }
            })
            .catch(function(error) {
                const myError = new LogError(error.message, 'Error fetching on email', -1, -1, -1);
                myError
                .save()
                res.status(200).json({
                    success: 0, 
                    error: 2,
                    error_code: 'ERROR_OCCURED',
                    errorMsg: 'An error occured while creating your account, ohno'
                });
            });
        } else {
            res.status(200).json({
                success: 0, 
                error: 1,
                error_code: 'INVALID_PASSWORD',
                errorMsg: 'The password should contain at least 1 character'
            });
        }
    } else {
        res.status(200).json({
            success: 0, 
            error: 10,
            error_code: 'INVALID_EMAIL',
            errorMsg: 'The email address provided is not a valid email'
        });
    }
}

const loginEmailSuccess = (res, id, admin, name, lng, studies, trial_start_date_epoch, trial_end_date_epoch, isValidSubscription, expiredSubscription) => {
    const accessToken = createAccessToken(id);
    const refreshToken = createRefreshToken(id);

    // Parse the date string
    // const startDatePaywall = trial_end_date_epoch;
    // console.log('startDatePaywall:'+startDatePaywall)
    // const startDateFreeTrial = startDatePaywall - TRIAL_DURATION_MS;

    res.status(200).json({
        success: 1,
        admin: admin,
        name: name,
        lng: lng,
        studies: studies,
        accessToken: accessToken,
        refreshToken: refreshToken,
        startDateFreeTrial: trial_start_date_epoch,
        startDatePaywall: trial_end_date_epoch,
        expiredSubscription: expiredSubscription,
        isValidSubscription: isValidSubscription
    })
}

exports.phonenumberRegistered = (req, res, next) => {
    Users
    .fetchOnPhonenumber(req.body.phonenumber)
    .then(([rows, fieldData]) => {
        if(rows.length>0) {
            res.status(200).json({
                success: 1, 
                registered: 1
            });
        } else {
            res.status(200).json({
                success: 1, 
                registered: 0
            });
        }
    })
    .catch(function(error) {
        const myError = new LogError(error.message, 'Error fetching on phonenumber:'+req.body.phonenumber, -1, -1, -1);
        myError
        .save()
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured while creating your account, ohno'
        });
    });
}

// exports.loginEmail = async (req, res, next) => {
//     console.log('loginEmail')
//     const email = req.body.email;
//     const password = req.body.password;
//     // const country_device = req.body.country_device;
//     const device_id = req.body.device_id;
//     let is_tablet = req.body.is_tablet;
//     let platform = req.body.platform;

//     is_tablet = is_tablet === undefined ? 2 : is_tablet;
//     platform = platform === undefined ? "unknown" : platform;


//     Users
//     .fetchOnEmail(email)
//     .then(([rows, fieldData]) => {
//         if(rows.length > 0) {
//             if(bcrypt.compareSync(password, rows[0].password)) {
//                 let isValidSubscription = false;
//                 const [rowsSubs, fieldData] = await Users.getValidSubscription(rows[0].id);
//                 if(rowsSubs.length>0) {
//                     isValidSubscription = true;
//                     Users.setActiveSubscription(rows[0].id, rowsSubs[0].expiryTimeMillis)
//                 }
                
//                 if(device_id == rows[0].phone_id || device_id == rows[0].tablet_id) {
//                     //TODO DELETE THIS TRUE 
//                     const myLogin = new Login(rows[0].id, device_id, platform, is_tablet);
//                     myLogin.save()
//                     loginEmailSuccess(res, rows[0].id, rows[0].admin, rows[0].name, rows[0].lng, rows[0].studies, rows[0].trial_end_date_epoch, isValidSubscription);
//                 } else {
//                     const oldDate = new Date(new Date(Date.now() - POSSIBLE_DEVICE_CHANGE_AFTER_MS).toISOString().slice(0, 19).replace('T', ' '))
//                     const phone_login = new Date(rows[0].phone_login);
//                     const tablet_login = new Date(rows[0].tablet_login);

//                     if(is_tablet) {
//                         if(oldDate > tablet_login) {
//                             Users.setTablet(rows[0].id, device_id).then(([rows2, fieldData]) => {
//                                 loginEmailSuccess(res, rows[0].id, rows[0].admin, rows[0].name, rows[0].lng, rows[0].studies, rows[0].trial_end_date_epoch, isValidSubscription);
//                             }).catch(err => 
//                                     { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, rows[0].id, -1, -1);
//                                     myError
//                             .save();});  
//                         } else {
//                             res.status(200).json({
//                                 success: 0, 
//                                 error: 5,
//                                 errorMsg: 'You can not change device at the moment',
//                                 error_code: 'CANNOT_CHANGE_DEVICE',
//                                 nb_days: NB_DAYS
//                             }); 
//                         }
//                     } else {
//                         if(oldDate > phone_login) {
//                             Users.setPhone(rows[0].id, device_id).then(([rows2, fieldData]) => {
//                                 loginEmailSuccess(res, rows[0].id, rows[0].admin, rows[0].name, rows[0].lng, rows[0].studies, rows[0].trial_end_date_epoch, isValidSubscription);
//                             }).catch(err => 
//                                     { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, rows[0].id, -1, -1);
//                                     myError
//                             .save();});  
//                         } else {
//                             res.status(200).json({
//                                 success: 0, 
//                                 error: 5,
//                                 errorMsg: 'You can not change device at the moment',
//                                 error_code: 'CANNOT_CHANGE_DEVICE',
//                                 nb_days: NB_DAYS
//                             }); 
//                         }
//                     }
//                 }
//             } else {
//                 res.status(200).json({
//                     success: 0, 
//                     error: 2,
//                     errorMsg: 'The email address and password do not match',
//                     error_code: 'EMAIL_PASSWORD_NOMATCH'
//                 }); 
//             }
//         } else {
//             res.status(200).json({
//                 success: 0,
//                 error: 1,
//                 errorMsg: 'This email address is not registered',
//                 error_code: 'EMAIL_NOT_REGISTERED'
//             });
//         }            
//     })
//     .catch(err => 
//         { const myError = new LogError(err.message, 'Loginemail Error fetch on email', -1, -1, -1);
//         myError
//         .save();});
// }
exports.loginEmail = async (req, res) => {
    console.log('loginEmail');
    let { email, password, device_id = "", is_tablet = 2, platform = "unknown" } = req.body;

    try {
        const user = await fetchUserByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: 0,
                error: 1,
                errorMsg: 'This email address is not registered',
                error_code: 'EMAIL_NOT_REGISTERED'
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(200).json({
                success: 0,
                error: 2,
                errorMsg: 'The email address and password do not match',
                error_code: 'EMAIL_PASSWORD_NOMATCH'
            });
        }

        const isValidSubscription = await checkValidSubscription(user);
        const hadSubscriptions = await foundSubscriptions(user);
        let expiredSubscription = false;
        if(!isValidSubscription && hadSubscriptions) {
            expiredSubscription = true;
        }
        await checkAndSetDevice(user, device_id, is_tablet, platform, isValidSubscription, res, expiredSubscription);
    } catch (err) {
        logError(err.message, 'Login email Error fetch on email', -1, -1, -1);
    }
};

async function fetchUserByEmail(email) {
    const [rows] = await Users.fetchOnEmail(email);
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
}

async function checkValidSubscription(user) {
    const [rowsSubs] = await Subscriptions.getValidSubscription(user.id);
    if (rowsSubs.length > 0) {
        await Users.setActiveSubscription(user.id, rowsSubs[0].expiryTimeMillis);
        return true;
    }
    return false;
}

async function foundSubscriptions(user) {
    const [rowsSubs] = await Subscriptions.getSubscriptions(user.id);
    if (rowsSubs.length > 0) {
        return true;
    }
    return false;
}

async function checkAndSetDevice(user, device_id, is_tablet, platform, isValidSubscription, res, expiredSubscription) {
    if (device_id === user.phone_id || device_id === user.tablet_id || device_id==="") {
        await loginUser(user, device_id, platform, is_tablet, isValidSubscription, res, expiredSubscription);
    } else {
        await attemptDeviceChange(user, device_id, is_tablet, isValidSubscription, res);
    }
}

async function loginUser(user, device_id, platform, is_tablet, isValidSubscription, res, expiredSubscription) {
    const login = new Login(user.id, device_id, platform, is_tablet);
    await login.save();
    loginEmailSuccess(res, user.id, user.admin, user.name, user.lng, user.studies, user.trial_start_date_epoch, user.trial_end_date_epoch, isValidSubscription, expiredSubscription);
}

async function attemptDeviceChange(user, device_id, is_tablet, isValidSubscription, res) {
    const oldDate = new Date(new Date(Date.now() - POSSIBLE_DEVICE_CHANGE_AFTER_MS).toISOString().slice(0, 19).replace('T', ' '))
    const phone_login = new Date(user.phone_login);
    const tablet_login = new Date(user.tablet_login);

    if(is_tablet) {
        if(oldDate > tablet_login) {
            Users.setTablet(user.id, device_id).then(([rows2, fieldData]) => {
                loginEmailSuccess(res, user.id, user.admin, user.name, user.lng, user.studies, user.trial_start_date_epoch, user.trial_end_date_epoch, isValidSubscription);
            }).catch(err => 
                    { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, user.id, -1, -1);
                    myError
            .save();});  
        } else {
            res.status(200).json({
                success: 0, 
                error: 5,
                errorMsg: 'You can not change device at the moment',
                error_code: 'CANNOT_CHANGE_DEVICE',
                nb_days: NB_DAYS
            }); 
        }
    } else {
        if(oldDate > phone_login) {
            Users.setPhone(user.id, device_id).then(([rows2, fieldData]) => {
                loginEmailSuccess(res, user.id, user.admin, user.name, user.lng, user.studies, user.trial_start_date_epoch, user.trial_end_date_epoch, isValidSubscription);
            }).catch(err => 
                    { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, user.id, -1, -1);
                    myError
            .save();});  
        } else {
            res.status(200).json({
                success: 0, 
                error: 5,
                errorMsg: 'You can not change device at the moment',
                error_code: 'CANNOT_CHANGE_DEVICE',
                nb_days: NB_DAYS
            }); 
        }
    }
}

function logError(errorMessage, errorDetail, userId, errorCode = -1, errorSubCode = -1) {
    const error = new LogError(errorMessage, errorDetail, userId, errorCode, errorSubCode);
    error.save();
}

exports.sendResetToken = async (req, res, next) => {
    const email = req.body.email;
    const resetToken = Math.floor(100000 + Math.random() * 900000);

    try {
        const [rows, fieldData] = await Users.setResetToken(email, resetToken)

        if(rows.affectedRows === 1) {
            // send email
            await handleEmails.sendResetToken(email, resetToken);
        } 

        res.status(200).json({
            success: 1
        });
    } catch (error) {
        const myError = new LogError(error.message, 'sendResetToken: error resetting password '+email, -1, -1, -1);
        myError
        .save();
        res.status(200).json({
            success: 0
        });
    }
}

exports.resetPassword = async (req, res, next) => {
    const email = req.body.email;
    const code = req.body.code;
    const password = req.body.password;

    try {
        const [rows, fieldData] = await Users.fetchOnEmail(email)
        if(rows.length > 0) {
            const currentDate = new Date(new Date().toISOString().slice(0, 19).replace('T', ' '))
            const resetExpiryDate = new Date(rows[0].reset_expiry_date);
            if(rows[0].reset_token.toString() === code && currentDate<resetExpiryDate) {
                await Users.setPassword(email, password);
                res.status(200).json({
                    success: 1
                });
            } else {
                res.status(200).json({
                    success: 0
                });
            }
        } else {
            res.status(200).json({
                success: 0
            });
        }
    } catch (error) {
        const myError = new LogError(error.message, 'ResetPassword Error fetch on email: '+email, -1, -1, -1);
        myError
        .save();
        res.status(200).json({
            success: 0
        });
    }
}

exports.checkResetPasswordCode = async (req, res, next) => {
    const email = req.body.email;
    const code = req.body.code;
    
    try {
        const [rows, fieldData] = await Users.fetchOnEmail(email)
        if(rows.length > 0) {

            const currentDate = new Date(new Date().toISOString().slice(0, 19).replace('T', ' '))
            const resetExpiryDate = new Date(rows[0].reset_expiry_date);

            if(rows[0].reset_token.toString() === code && currentDate<resetExpiryDate) {
                res.status(200).json({
                    success: 1
                });
            } else {
                res.status(200).json({
                    success: 0
                });
            }
        } else {
            res.status(200).json({
                success: 0
            });
        }
    } catch (error) {
        const myError = new LogError(error.message, 'checkResetPasswordCode Error fetch on email: '+email, -1, -1, -1);
        myError
        .save();
        res.status(200).json({
            success: 0
        });
    }
}

exports.getUsers = async(req, res, next) => {
    console.log('getUsers')

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rows.length>0) {
            if(rows[0].admin) {
                const [rows, fieldData] = await Users.getUsers();

                res.status(200).json({
                    success: 1,
                    users: rows
                });
            } else {
                throw Error();
            }
        } else {
            throw Error();
        }
    } catch (error) {
        const myError = new LogError(error.message, 'getUsers', -1, -1, -1);
        myError
        .save();
        console.error("Cannot get users ", error);
        res.status(200).json({
            success: 0
        });
    }
}

exports.sendVerificationSMS = (req, res, next) => {
    const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
    const phonenumber = req.body.phonenumber;
    const lng = req.body.lng;
    const token = req.body.token;
    let message = 'This is your PIN: ' + token + ". Please do not share it with anyone."
    if(lng === 'de') {
        message = 'Dies ist Ihre PIN: ' + token + ". Bitte geben Sie diese Informationen nicht an Dritte weiter."
    }

    client.messages
        .create({
            to: phonenumber,
            from: phonenumberSender,
            body: message,
        })
        .then(() => {
            const myPhone = new Phone(-1, phonenumber, true, token);
            myPhone
            .save()
            .then(([rows, fieldData]) => {
                res.status(200).json({
                    success: 1,
                });
            })
            .catch(function(error) {
                console.log(error)
                res.status(200).json({
                    success: 0, 
                });
            });
        })
        .catch((error) => {
            const myError = new LogError(error.message, 'sendVerificationSMS:'+phonenumber, -1, -1, -1);
            myError
            .save();
            const myPhone = new Phone(-1, phonenumber, false, token);
            myPhone
            .save()
            .then(([rows, fieldData]) => {
                res.status(200).json({
                    success: 0,
                });
            })
            .catch(function(error) {
                console.log(error)
                res.status(200).json({
                    success: 0, 
                });
            });
        });
};



const { google } = require('googleapis');

const clientEmail = 'myuser@pharmazingmarketing.iam.gserviceaccount.com';
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCOSlK8ttGIUpgo\nmZ/ZkJzbCEVxqVQbvAPNSMfSqDNuVXLIARvTvhmGKQquhO1OYQFEAFdcLT103CK9\njajm94HszkcdItu2uYeqBzJsbgw0OTZDuChBQoQMuELPreKyZ6B4uwqc9nMsjHjj\nUOIqUWzDmPnaMFp7Yj+bHT7f9RgLX2qrPUukaQo10Ki35fHstieq35HOiYP6l7tA\n3VFTzztC1XBLFrecvI1aGXjZJLB2Wq4Jro7KMLpNfiJS1MTdPlYacIQSTdDuaCAH\nKg1RrhKdBQD/FDkEFbfp7bIPsj+6VjqBGa4drBSGJAc7j0xxq8Kr5V+lV+30NlNi\nEOMA3GhNAgMBAAECggEAGk2s+8vD8jJqhF7ZyOtNw8PEqp1FuhbIkSNaJRwI3eWX\n4VcrILpsl3twyRAzmiCejkaN37FRQhALsATG62NntjHvvXgbK60iYhEQhjDVurW0\nzVH2xxGXvY42c5POa3JynL7e2GNKqTqSglsKZA5HT+UwkuALafGglnkSjW4OctN7\nH3pgIiAlQ6akhfkoN5SBvT7+z1/92ELEKGpILJM96h5FdCw3MBhH4F5k5MQNweYV\n6UsFkBBKwFjdVy4ppT5GKk0bbJ5y7Mrs6mPZZT7dRPEXSL90nbE5/IftOiPDRzBn\n0uJEKcGkI72tHnzbbdYEiF8cbH2wIR49cqAJ829LFQKBgQDBiwYEFsLdrOz7ZCA0\nI9BZy3SRzeTDo2UU/Q/CcR2GKjBd6mR161S0ITPYQRnlK6J/BwsCagHYZepW8zFH\nW757dHYYoSAbyQjqJrHGSVJclemmYngARNRt1abm8O39W7Yr9ItVwuXyvWg8X02v\nRseeZ9dz7O2urhJZzDknQlgxEwKBgQC8NTWeTlBqtLd3uffGbs0459Vp5wQcMOVY\nE7Mspry6M8tDpTsHYu/eR6lmHxyN2CwsvcZf/8mQY7U64UlpyD9FB6kHj/1u7FJj\n5KM4SAUbJJOloS4UgS0Nhfu96XmS9rB5p7UOSmFstLn/z46jN6p3xEM8+hDvZ07h\nNASPkh2NHwKBgQC8EJ0d6AgeY2Q7u0VXpN1WA88XxtveBq24QVbI+CVaMzCgcZyA\nwNWj2weHwWqqN0ZE7NET3XJBlnapWtKtpkZnq/j9YcPTe/t/m23vYVv4v2s01EYK\n7NcGiy8NBVwcbruL5qpmAWZ0AvyAfZL9GGfsUrcW3EjxDhCi1UFMFrmfpQKBgQCk\nYjEfwLUaTheE2ggg5/wVPOA47E65tLdME4DGeieS1tQtlC6XiAGL+rlpebj95xbG\nSUbv6ECL/Zp3//eYDg+84jDvawNnE7/uge9RpA3ZpDvVSY8u15ibHDBBsp++Dfsb\ndrB799laEgv287lYs7EPhHtZ0exiva+2oTFumKd47wKBgCvKSfSAxLx/ZMx+Juqq\ne6YBlCqrgz2OaX3chdc4zYXJ5S5iePtxf3lyCcYVvUKRprp/Ft3FgCwVjpSJjZjV\n2jUOTjy3DlVo3x6zkr2FzVOI5e/sX9GaGqZX4DlXLcM2FNKGqpk3ge8clzke+AlJ\nIeRcXOmpijLaj4XyhI3wtl+W\n-----END PRIVATE KEY-----\n";
const googleSheetId = '1GhKUZwqI-ox2Qhk5SwXRgIIBQO-b7M85OGB3qqEQrqQ';
const googleSheetPage = 'Sheet2';
const googleSheetPageUniversities = 'Universities';

// authenticate the service account
const googleAuth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey.replace(/\\n/g, '\n'),
    'https://www.googleapis.com/auth/spreadsheets'
);

async function clearSheet() {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      // clear data in the range
      await sheetInstance.spreadsheets.values.clear({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPage}!A6:Z10000`,
      });
    }
    catch(err) {
      console.log("clearSheet func() error", err);  
    }
}
  
async function updateSheet(updateToGsheet) {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      console.log('updateSheetYENTE:'+updateToGsheet.length)
      // update data in the range
      await sheetInstance.spreadsheets.values.update({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPage}!A10:V`+(updateToGsheet.length+1000).toString(),
          valueInputOption: 'RAW',
          resource: {
            values: updateToGsheet,
          },
      });
    }
    catch(err) {
      console.log("updateSheet func() error", err);  
    }
}

async function updateSheetActive(updateToGsheet) {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      
      // update data in the range
      await sheetInstance.spreadsheets.values.update({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPage}!P3:T8`.toString(),
          valueInputOption: 'RAW',
          resource: {
            values: updateToGsheet,
          },
      });
    }
    catch(err) {
      console.log("updateSheet func() error", err);  
    }
}


async function updateSheetUniversities(updateToGsheet) {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      
      await sheetInstance.spreadsheets.values.clear({
        auth: googleAuth,
        spreadsheetId: googleSheetId,
        range: `${googleSheetPageUniversities}!A2:Z1000`,
      });
      // update data in the range
      await sheetInstance.spreadsheets.values.update({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPageUniversities}!A2:Z1000`.toString(),
          valueInputOption: 'RAW',
          resource: {
            values: updateToGsheet,
          },
      });
    }
    catch(err) {
      console.log("updateSheet func() error", err);  
    }
}


async function updateSheetAverage(days_7, days_30) {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
      
      // update data in the range
      await sheetInstance.spreadsheets.values.update({
          auth: googleAuth,
          spreadsheetId: googleSheetId,
          range: `${googleSheetPage}!F2:G2`.toString(),
          valueInputOption: 'RAW',
          resource: {
            values: [[days_7, days_30]],
          },
      });
    }
    catch(err) {
      console.log("updateSheet func() error", err);  
    }
}

exports.setMarketingData = async(req, res, next) => {
    const userId = req.user.user_id;
    const fcmToken = req.body.token;

    try {
        const [rows, fieldData] = await Users.fetchOnId(userId);
        if(rows.length>0) {
            if(rows[0].admin) {
                const [rows2, fieldData] = await Users.marketing();
                const [rowsActive, fieldData2] = await Users.marketingActiveUsers();
                const [rowsAvg, fieldData4] = await Users.averageCost7_30_days();

                let dataActive = [];
                for(let i=0; i<rowsActive.length; i++) {
                    console.log('Active studies_category:'+rowsActive[i].studies_category)
                    dataActive.push([rowsActive[i].studies_category, rowsActive[i].users_today, rowsActive[i].users_yesterday, rowsActive[i].users_last_7_days, rowsActive[i].users_last_30_days])
                }
                console.log('Active classes:'+rowsActive.length)
                await updateSheetActive(dataActive)

                const [rowsUniversities, fieldData3] = await Users.marketingUniversities();
                await updateSheetUniversities(dataActive)
                
                let data = []
                data.push(['user id', 'name', 'email','phonenumber','studies','university','signup date','phone','tablet','prompt tokens cost','completion tokens cost','total cost', 'total cost 7d', 'total cost 30d','total questions','questions 7d','questions 30d','total followup question','followup question 7d','followup question 30d'])
                for(let i=0; i<rows2.length; i++) {
                    let tempUser = [
                                    rows2[i].user_id,
                                    rows2[i].name,
                                    rows2[i].email,
                                    rows2[i].phonenumber,
                                    rows2[i].studies_translated,
                                    rows2[i].university,
                                    rows2[i].signup_date,
                                    rows2[i].uses_phone,
                                    rows2[i].uses_tablet,
                                    parseFloat(rows2[i].prompt_tokens_cost),
                                    parseFloat(rows2[i].completion_tokens_cost),
                                    parseFloat(rows2[i].prompt_tokens_cost)+parseFloat(rows2[i].completion_tokens_cost),
                                    parseFloat(rows2[i].prompt_tokens_cost_7d)+parseFloat(rows2[i].completion_tokens_cost_7d),
                                    parseFloat(rows2[i].prompt_tokens_cost_30d)+parseFloat(rows2[i].completion_tokens_cost_30d),
                                    rows2[i].total_questions,
                                    rows2[i].questions_7_days,
                                    rows2[i].questions_30_days,
                                    rows2[i].follow_up_total_questions,
                                    rows2[i].follow_up_questions_7_days,
                                    rows2[i].follow_up_questions_30_days]
                    data.push(tempUser)
                }
                await clearSheet()
                await updateSheet(data)
                await updateSheetActive(dataActive)
                if(rowsAvg.length == 2) {
                    await updateSheetAverage(parseFloat(rowsAvg[0].average_cost), parseFloat(rowsAvg[1].average_cost))
                }

                res.status(200).json({
                    success: 1,
                    users: rows2
                });
            } else {
                throw Error();
            }
        } else {
            throw Error();
        }
    } catch (error) {
        const myError = new LogError(error.message, 'setMarketing', -1, -1, -1);
        myError
        .save();
        console.error("Cannot setmarketing ", error);
        res.status(200).json({
            success: 0
        });
    }
}

const sendMailerLite = (email) => {
    const groupId = '118357549113149028'
    const axios = require('axios');

    const url = `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`;

    const subscriber_data = {
        email: email,
    };

    const headers = {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': process.env.MAILERLITE_APIKEY
    };

    axios.post(url, subscriber_data, { headers })
        .then(response => {
            if (response.status === 200) {
                // console.log("Subscriber added successfully.");
            } else {
                // console.log("Successful request, but unexpected status code:", response.status);
            }
        })
        .catch(error => {
            if (error.response) {
                const myError = new LogError('Error mailerlite:', email, -1, -1, -1);
                myError
                .save();
            } else if (error.request) {
                const myError = new LogError('Error mailerlite:', email, -1, -1, -1);
                myError
                .save();
            } else {
                const myError = new LogError('Error mailerlite:', email, -1, -1, -1);
                myError
                .save();
            }
        });

}

