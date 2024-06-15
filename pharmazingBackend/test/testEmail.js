const sendResetToken = async (email, sendResetToken) => {
    var nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your SMTP server
        port: 465, // For SSL. For TLS, use 587
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'app@pharmazing.de', // your Hostinger email address
          pass: "BuenosAires5755696998736!!?" // your Hostinger email password
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

async function main() {
    try {
        sendResetToken("jentebeerten@gmail.com", "123456")
} catch (error) {
    console.error(error);
}
}

main();

