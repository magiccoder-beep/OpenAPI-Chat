exports.sendConfirmationEmail = async () => {
    var nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your SMTP server
        port: 465, // For SSL. For TLS, use 587
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'app@pharmazing.de', // your Hostinger email address
          pass: process.env.EMAIL_PASS // your Hostinger email password
        }
    });

    let mailOptions = {
        from: '"Pharmazing" <app@pharmazing.de>', // sender address
        to: email, // list of receivers
        subject: 'Confirmed email',
        text: 'Your email has been confirmed' 
        //html: '<b>Hello world?</b>' // html body
    };

    try {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    } catch (error) {
        console.error("Failed sending email:", error);
        throw error;
    }
};

exports.sendResetToken = async (email, sendResetToken) => {
    var nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your SMTP server
        port: 465, // For SSL. For TLS, use 587
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'app@pharmazing.de', // your Hostinger email address
          pass: process.env.EMAIL_PASS // your Hostinger email password
        }
    });

    let mailOptions = {
        from: '"Pharmazing" <app@pharmazing.de>', // sender address
        to: email, // list of receivers
        subject: 'Sie haben beantragt, Ihr Passwort zurückzusetzen',
        text: 'Hier ist Ihr Reset-Token: '+ sendResetToken 
        //html: '<b>Hello world?</b>' // html body
    };

    try {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    } catch (error) {
        console.error("Failed sending email:", error);
        throw error;
    }
};

exports.sendErrorMail = async (subject, text) => {
    var nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your SMTP server
        port: 465, // For SSL. For TLS, use 587
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'app@pharmazing.de', // your Hostinger email address
          pass: process.env.EMAIL_PASS // your Hostinger email password
        }
    });

    let mailOptions = {
        from: '"Pharmazing" <app@pharmazing.de>', // sender address
        to: "jentebeerten@gmail.com", // list of receivers
        subject: subject,
        text: text 
        //html: '<b>Hello world?</b>' // html body
    };

    try {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    } catch (error) {
        console.error("Failed sending email:", error);
        throw error;
    }
};