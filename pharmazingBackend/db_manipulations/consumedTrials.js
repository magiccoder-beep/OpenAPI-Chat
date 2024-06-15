const db = require('../util/database');

exports.fetchOnPhonenumber = (phonenumber) => {
    console.log('models/consumedTrial/phonenumber');
    return db.execute("SELECT * FROM pharmazing.consumedTrials where phonenumber=?", [phonenumber]); 
}