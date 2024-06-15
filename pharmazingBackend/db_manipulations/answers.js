const db = require('../util/database');

// exports.fetchOnId = (question_id) => {
//     console.log('models/answer/fetchOnId');
//     return db.execute("SELECT * FROM pharmazing.answers where question_id="+question_id); 
// }

// order by linked_answer_id so the original answer will on position 0
exports.fetchOnQuestionId = async (question_ids) => {
    const placeholders = question_ids.map(() => '?').join(', ');
    const sql = `SELECT * FROM pharmazing.answers where question_id IN (${placeholders}) order by linked_answer_id `;

    try {
        return db.execute(sql, question_ids); 
    } catch (error) {
        console.error("Error fetching answer based on id:"+question_ids.join(), error);
        throw error;
    }
};

exports.answerValidBasedUponVotes = (question_id) => {
    const placeholders = question_ids.map(() => '?').join(', ');
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
            question_id IN (${placeholders}) AND a.main_answer=1
        GROUP BY
            a.id) as sub
    WHERE
        (sub.total_downvotes)/(sub.total_downvotes+sub.total_upvotes) <= 0.8 AND (sub.total_downvotes+sub.total_upvotes)>=4;
    `,
    [question_id]
    );
}

exports.updateVotes = (answer_id, upvote, downvote) => {
    console.log('models/answers/updateVotes');
    try {
        return db.execute(
            'UPDATE pharmazing.answers set upvote=upvote+?, downvote=downvote+?, updated_at=? where id=? OR linked_answer_id=?',
            // 'UPDATE pharmazing.answers set upvote=upvote+1, downvote=downvote+1, updated_at=? where id=?',
            [upvote, downvote, new Date().toISOString().slice(0, 19).replace('T', ' '), answer_id, answer_id]
        );
    } catch (error) {
        console.error("Error updating answer votes:"+answer_id+" upvote:"+upvote+" downvote:"+downvote, error);
        throw error;
    }
}