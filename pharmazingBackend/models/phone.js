const db = require('../util/database');

module.exports = class Phones {
  constructor(id, phonenumber, success, token) {
    this.id = id;
    this.phonenumber = phonenumber;
    this.success = success;
    this.token = token;
  }
  
  save() {
    console.log('savePhone')
    let currentTime = new Date();
    return db.execute(
    'INSERT INTO pharmazing.phones (phonenumber, success, token, token_expiry_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [this.phonenumber, this.success, this.token, new Date(currentTime.getTime() + 15 * 60000).toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}
