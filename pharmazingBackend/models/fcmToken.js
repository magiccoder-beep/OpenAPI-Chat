const db = require('../util/database');

module.exports = class fcmTokens {
  constructor(user_id, platform, fcm_token, is_tablet, device_id) {
    this.user_id = user_id;
    this.platform = platform;
    this.fcm_token = fcm_token;
    this.is_tablet = is_tablet;
    this.device_id = device_id;
  }
  
  async save() {
    console.log("save fcmTokens");
  
    // step 0 check if token already exists
    const [rowsTokens] = await db.execute(
        'SELECT * FROM pharmazing.fcmTokens WHERE fcm_token = ? AND user_id = ?',
        [this.fcm_token, this.user_id]
    );

    if (rowsTokens.length === 0) {
        // Step 1: Check if the device_id number exists
        const [rows] = await db.execute(
        'SELECT * FROM pharmazing.fcmTokens WHERE user_id = ? AND device_id = ?',
        [this.user_id, this.device_id]
        );
    
        // If the device id does not exist for user_id, insert the new record
        if (rows.length === 0) {
        return db.execute(
            'INSERT INTO pharmazing.fcmTokens (user_id, platform, fcm_token, is_tablet, device_id, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [this.user_id, this.platform, this.fcm_token, this.is_tablet, this.device_id,new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
        );
        } else {
        // If the device id exists, update the fcm token by replacing with new value
        return db.execute(
            'UPDATE pharmazing.fcmTokens SET fcm_token = ?, is_tablet = ?, platform = ?, updated_at = ? WHERE device_id = ? AND user_id = ?',
            [this.fcm_token, this.is_tablet, this.platform, new Date().toISOString().slice(0, 19).replace('T', ' '), this.device_id, this.user_id]
        );
        }
    } else {
        return db.execute(
            'UPDATE pharmazing.fcmTokens SET device_id = ?, is_tablet = ?, platform = ?, updated_at = ? WHERE fcm_token = ? AND user_id = ?',
            [this.device_id, this.is_tablet, this.platform, new Date().toISOString().slice(0, 19).replace('T', ' '), this.fcm_token, this.user_id]
        );
    }
  }
}