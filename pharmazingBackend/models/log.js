const db = require('../util/database');

module.exports = class Errors {
  constructor(user_id, screen, action, log) {
    if(action.length >= 50) {
        this.action = action.substring(0, 50);
    } else {
        this.action = action;
    }
    this.user_id = user_id;
    this.screen = screen;
    if(log.length >= 300) {
        this.log = log.substring(0, 300);
    } else {
        this.log = log;
    }
  }
  
  save() {
    console.log("save log")
    return db.execute(
    'INSERT INTO pharmazing.logs (user_id, screen, action, log, created_at) VALUES (?, ?, ?, ?, ?)',
    [this.user_id, this.screen, this.action, this.log, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}