const db = require('../util/database');

module.exports = class Logins {
  constructor(user_id, device_id, platform, is_tablet) {
    this.user_id = user_id;
    this.device_id = device_id;
    this.platform = platform;
    this.is_tablet = is_tablet;
  }
  
  save() {
    console.log("save login")
    return db.execute(
    'INSERT INTO pharmazing.logins (user_id, device_id, platform, is_tablet, created_at) VALUES (?, ?, ?, ?, ?)',
    [this.user_id, this.device_id, this.platform, this.is_tablet, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}