const db = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class Users {
  constructor(id, email, semester, affiliate_code, password,occupation, sms_confirmed, email_confirmed, platform, phonenumber, name, surname, city, university, studies, country, country_device, device_id, trial, trial_start_date_epoch, trial_end_date, trial_end_date_epoch, active_subscription, subscription_start_date, subscription_end_date, reset_token="", reset_expiry_date=new Date().toISOString().slice(0, 19).replace('T', ' '), is_tablet=false) {
    this.id = id;
    this.email = email;
    this.semester = semester;
    this.affiliate_code = affiliate_code;
    this.password = bcrypt.hashSync(password, 10);
    this.sms_confirmed = sms_confirmed;
    this.email_confirmed = email_confirmed;
    this.platform = platform;
    this.phonenumber = phonenumber;
    this.university = university;
    this.name = name;
    this.surname = surname;
    this.city = city;
    this.studies = studies;
    this.country = country;
    this.country_device = country_device;
    this.device_id = device_id;
    this.trial = trial;
    this.trial_start_date_epoch = trial_start_date_epoch
    this.trial_end_date = trial_end_date;
    this.trial_end_date_epoch = trial_end_date_epoch;
    this.active_subscription = active_subscription;
    this.subscription_start_date = subscription_start_date;
    this.subscription_end_date = subscription_end_date;
    this.reset_token = reset_token;
    this.reset_expiry_date = reset_expiry_date;
    this.is_tablet = is_tablet;
    this.occupation = occupation;
  }
  
  save() {
    console.log('saving user')
    return db.execute(
    'INSERT INTO pharmazing.users (email, semester, affiliate_code, password, occupation, trial, trial_start_date_epoch, trial_end_date, trial_end_date_epoch, active_subscription, subscription_start_date, subscription_end_date, platform, phonenumber, name, surname, university, studies, city, country, country_device, phone_id, tablet_id, phone_login, tablet_login, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?, ?, ?)',
    [this.email, this.semester, this.affiliate_code, this.password, this.occupation, this.trial, this.trial_start_date_epoch, this.trial_end_date, this.trial_end_date_epoch, this.active_subscription, this.subscription_start_date, this.subscription_end_date, this.platform, this.phonenumber, this.name, this.surname, this.university, this.studies, this.city, this.country, this.country_device, this.is_tablet?"":this.device_id, this.is_tablet?this.device_id:"", this.is_tablet?new Date('2000-01-01'):new Date().toISOString().slice(0, 19).replace('T', ' '), this.is_tablet?new Date().toISOString().slice(0, 19).replace('T', ' '):new Date('2000-01-01'), new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }

  update() {
    console.log('models/user/update');
    return db.execute(
        'UPDATE users set email=?, password=?, sms_confirmed=?, email_confirmed=?, platform=?, phonenumber=?, trial=?, active_subscription=?, subscription_start_date=?, subscription_end_date=?, reset_token=?, reset_expiry_date=?, updated_at=? where id=?',
        [this.email, bcrypt.hashSync(this.password, 10), this.sms_confirmed, this.email_confirmed, this.platform, this.phonenumber, this.trial, this.active_subscription, this.subscription_start_date, this.subscription_end_date, this.reset_token, this.reset_expiry_date, new Date().toISOString().slice(0, 19).replace('T', ' '), this.id]
    );
  }
}
