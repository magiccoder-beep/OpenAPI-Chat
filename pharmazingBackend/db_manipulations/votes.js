const db = require('../util/database');

exports.answerValidBasedUponVotes = (question_id) => {
    console.log('db_man/votes/answerValidBasedUponVotes');
    return db.execute(
    `
    SELECT
        sub.answer_id,
        sub.total_upvotes,
        sub.total_downvotes,
        sub.question_id,
        sub.answer
    FROM
        (SELECT
            a.id as answer_id,
            SUM(v.upvote) as total_upvotes,
            SUM(v.downvote) as total_downvotes,
            a.question_id,
            a.answer
        FROM
            pharmazing.answers a
        JOIN
            pharmazing.votes v ON a.id = v.answer_id
        WHERE
            question_id = ?
        GROUP BY
            a.id) as sub
    WHERE
        sub.total_downvotes = 0;
    `,
    [question_id]
    );
}

exports.fetchVotes = (user_id, answer_id) => {
    console.log('models/votes/fetchVotes');
    return db.execute("SELECT * FROM pharmazing.votes where user_id=? AND answer_id=?", [user_id, answer_id]); 
}