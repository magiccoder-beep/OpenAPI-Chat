const db = require('../util/database');

module.exports = class Subscriptions {
  constructor(id, user_id, platform, productId, acknowledgementState, purchaseToken, orderId) {
    this.id = id;
    this.user_id = user_id;
    this.platform = platform;
    this.productId = productId;
    this.acknowledgementState = acknowledgementState;
    this.purchaseToken = purchaseToken;
    this.orderId = orderId;
  }
  
  save() {
    console.log('save subscription')
    console.log(this.orderId)
    return db.execute(
    'INSERT INTO pharmazing.subscriptions (user_id, platform, productId, acknowledgementState, purchaseToken, orderId,  created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [this.user_id, this.platform, this.productId, this.acknowledgementState, this.purchaseToken, this.orderId, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}