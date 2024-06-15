const db = require('../util/database');

module.exports = class Votes {
  constructor(id, user_id, answer_id, upvote, downvote) {
    this.id = id;
    this.user_id = user_id;
    this.answer_id = answer_id;
    this.upvote = upvote;
    this.downvote = downvote;
  }
  
  save() {
    console.log('saveVote')
    return db.execute(
    'INSERT INTO pharmazing.votes (user_id, answer_id, upvote, downvote, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [this.user_id, this.answer_id, this.upvote, this.downvote, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
  }
}
