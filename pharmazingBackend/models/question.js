const db = require('../util/database');

module.exports = class Questions {
  constructor(id, user_id, appversion, keywords, question, lng, related=true, follow_up_question=false, main_question_id=-1, calculation=false, improved_model) {
    this.id = id;
    this.appversion = appversion;
    this.user_id = user_id;
    if (keywords.length >= 400) {
      this.keywords = keywords.substring(0, 400);
    } else {
      this.keywords = keywords;
    }
    this.question = question;
    this.lng = lng;
    this.related = related;
    this.follow_up_question = follow_up_question;
    this.main_question_id = main_question_id;
    this.calculation = calculation;
    this.improved_model = improved_model;
  }
  
  save() {
    console.log()
    return db.execute(
    'INSERT INTO pharmazing.questions (user_id, appversion, improved_model, calculation, main_question_id, keywords, question, lng, related, follow_up_question, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [this.user_id, this.appversion, this.improved_model, this.calculation, this.main_question_id, this.keywords, this.question, this.lng, this.related,this.follow_up_question,new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }

//   update() {
//     console.log('models/user/update');
//     return db.execute(
//         'UPDATE users set email=?, password=?, sms_confirmed=?, email_confirmed=?, platform=?, phonenumber=?, trial=?, active_subscription=?, subscription_start_date=?, subscription_end_date=?, reset_token=?, reset_expiry_date=?, updated_at=? where id=?',
//         [this.email, this.password, this.sms_confirmed, this.email_confirmed, this.platform, this.phonenumber, this.trial, this.active_subscription, this.subscription_start_date, this.subscription_end_date, this.reset_token, this.reset_expiry_date, new Date().toISOString().slice(0, 19).replace('T', ' '), this.id]
//     );
//   }
}
