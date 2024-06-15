const db = require('../util/database');

module.exports = class ConsumedTrials {
  constructor(phonenumber, consumed_millis) {
    this.phonenumber = phonenumber;
    this.consumed_millis = consumed_millis;
  }
  
//   save() {
//     console.log("save consumedTrial")
//     return db.execute(
//     'INSERT INTO pharmazing.consumedTrials (phonenumber, consumed_millis, updated_at, created_at) VALUES (?, ?, ?, ?)',
//     [this.phonenumber, this.consumed_millis, new Date().toISOString().slice(0, 19).replace('T', ' '),new Date().toISOString().slice(0, 19).replace('T', ' ')]
//     );
//   }

  async save() {
    console.log("save consumedTrial");
  
    // Step 1: Check if the phone number exists
    const [rows] = await db.execute(
      'SELECT * FROM pharmazing.consumedTrials WHERE phonenumber = ?',
      [this.phonenumber]
    );
  
    // If the phone number does not exist, insert the new record
    if (rows.length === 0) {
      return db.execute(
        'INSERT INTO pharmazing.consumedTrials (phonenumber, consumed_millis, updated_at, created_at) VALUES (?, ?, ?, ?)',
        [this.phonenumber, this.consumed_millis, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
      );
    } else {
      // If the phone number exists, update the consumed_millis by adding the new value to the existing one
      return db.execute(
        'UPDATE pharmazing.consumedTrials SET consumed_millis = consumed_millis + ?, updated_at = ? WHERE phonenumber = ?',
        [this.consumed_millis, new Date().toISOString().slice(0, 19).replace('T', ' '), this.phonenumber]
      );
    }
  }
}

