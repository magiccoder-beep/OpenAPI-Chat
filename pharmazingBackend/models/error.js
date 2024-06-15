const db = require('../util/database');
const handleEmails = require('../general/email');

module.exports = class Errors {
  constructor(error, type, user_id=-1, question_id=-1, answer_id=-1) {
    this.question_id = question_id;
    this.answer_id = answer_id;
    if(type.length >= 100) {
        this.type = type.substring(0, 100);
    } else {
        this.type = type;
    }
    this.user_id = user_id;
    if(error.length >= 500) {
        this.error = error.substring(0, 500);
    } else {
        this.error = error;
    }
  }
  
  save() {
    console.log("save error")
    try {
      handleEmails.sendErrorMail(this.type, this.error)
    } catch(error) {
      console.log(this.error)
    }
    return db.execute(
    'INSERT INTO pharmazing.errors (question_id, answer_id, type, user_id, error, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [this.question_id, this.answer_id, this.type, this.user_id, this.error, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}