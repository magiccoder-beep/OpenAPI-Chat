const db = require('../util/database');

module.exports = class Tokens {
  constructor(user_id, type, prompt_tokens, completion_tokens, question_id, model) {
    this.user_id = user_id;
    this.type = type;
    this.prompt_tokens = prompt_tokens;
    this.completion_tokens = completion_tokens;
    this.question_id = question_id;
    this.model = model;
  }
  
  save() {
    console.log("save tokens")
    return db.execute(
    'INSERT INTO pharmazing.tokens (user_id, model, type, prompt_tokens, completion_tokens, question_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [this.user_id, this.model, this.type, this.prompt_tokens, this.completion_tokens, this.question_id, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}