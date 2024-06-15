const db = require('../util/database');

module.exports = class Answers {
  constructor(id, question_id, answer, lng, linked_answer_id=-1, main_answer=true, improved_model) {
    this.id = id;
    this.question_id = question_id;
    if(answer.length >= 4000) {
      this.answer = answer.substring(0, 4000);
    } else {
        this.answer = answer;
    }
    this.lng = lng;
    this.linked_answer_id = linked_answer_id;
    this.main_answer = main_answer;
    this.improved_model = improved_model;
  }
  
  save() {
    console.log("save answer")
    return db.execute(
    'INSERT INTO pharmazing.answers (question_id, improved_model, answer, lng, linked_answer_id, main_answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [this.question_id, this.improved_model, this.answer, this.lng, this.linked_answer_id, this.main_answer, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}