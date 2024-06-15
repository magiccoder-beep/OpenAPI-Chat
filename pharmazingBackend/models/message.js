const db = require('../util/database');

module.exports = class Messages {
  constructor(question_id, role, user_id, content, contentImages, images, textParts) {
    this.question_id = question_id;
    this.role = role;
    this.user_id = user_id;
    this.content = content;
    this.contentImages = contentImages;
    this.images = images,
    this.textParts = textParts
  }
  
  save() {
    console.log("save message")
    const imagesJSON = JSON.stringify(this.images);
    const textPartsJSON = JSON.stringify(this.textParts);
    return db.execute(
    'INSERT INTO pharmazing.messages (question_id, role, user_id, content, contentImages, images, textParts, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [this.question_id, this.role, this.user_id, this.content, this.contentImages, imagesJSON, textPartsJSON, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}