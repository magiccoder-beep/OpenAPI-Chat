const db = require('../util/database');

exports.findSimilarQuestions = (keywords, questionChars) => {
    console.log('db_man/questions/findSimilarQuestions');
    for(let i=0; i<keywords.length; i++) {
        keywords[i] = '%' + keywords[i] + '%';
    }
    const nb_keywords = Math.min(3, keywords.length);

    if(nb_keywords==2) {
        return db.execute(
            `
            SELECT *
            FROM pharmazing.questions q
            INNER JOIN pharmazing.answers a ON a.question_id=q.id
            WHERE (
                (keywords LIKE ?) +
                (keywords LIKE ?) 
            ) >= 1 AND linked_answer_id=-1 AND refer_question_id=-1 AND follow_up_question=0 AND CHAR_LENGTH(question)>?*0.7 AND CHAR_LENGTH(question)<?*1.3
            ;`,
            [keywords[0], keywords[1], questionChars, questionChars]
        );
    }
    else if(nb_keywords==3) {
        return db.execute(
            `SELECT *
            FROM pharmazing.questions q
            INNER JOIN pharmazing.answers a ON a.question_id=q.id 
            WHERE (
                (keywords LIKE ?) +
                (keywords LIKE ?) +
                (keywords LIKE ?) 
            ) >= 2 AND linked_answer_id=-1 AND refer_question_id=-1 AND follow_up_question=0 AND CHAR_LENGTH(question)>?*0.7 AND CHAR_LENGTH(question)<?*1.3;`,
            [keywords[0], keywords[1], keywords[2], questionChars, questionChars]
        );
    }
    else if(nb_keywords==1) {
        return db.execute(
            `SELECT *
            FROM pharmazing.questions q
            INNER JOIN pharmazing.answers a ON a.question_id=q.id
            WHERE (
                (keywords LIKE ?)
            ) >= 1 AND linked_answer_id=-1 AND refer_question_id=-1 AND follow_up_question=0 AND CHAR_LENGTH(question)>?*0.7 AND CHAR_LENGTH(question)<?*1.3;`,
            [keywords[0], questionChars, questionChars]
        );
    } else {
        return db.execute(
            `SELECT * FROM pharmazing.questions WHERE 0=1;`,
            []
        );
    }

    // if(nb_keywords==2) {
    //     return db.execute(
    //         `SELECT * FROM pharmazing.questions 
    //             WHERE (
    //             (keywords LIKE ?) +
    //             (keywords LIKE ?) 
    //         ) >= 1;`,
    //         [keywords[0], keywords[1]]
    //     );
    // }
    // else if(nb_keywords==3) {
    //     return db.execute(
    //         `SELECT * FROM pharmazing.questions 
    //             WHERE (
    //             (keywords LIKE ?) +
    //             (keywords LIKE ?) +
    //             (keywords LIKE ?) 
    //         ) >= 2;`,
    //         [keywords[0], keywords[1], keywords[2]]
    //     );
    // }
    // else if(nb_keywords==1) {
    //     return db.execute(
    //         `SELECT * FROM pharmazing.questions 
    //             WHERE (
    //             (keywords LIKE ?)
    //         ) >= 1;`,
    //         [keywords[0]]
    //     );
    // } else {
    //     return db.execute(
    //         `SELECT * FROM pharmazing.questions WHERE 0=1;`,
    //         []
    //     );
    // }
}

exports.updateQuestion = (question_id, refer_question_id) => {
    console.log('db_man/questions/updateQuestion');
    return db.execute(
        'UPDATE pharmazing.questions set refer_question_id=?, updated_at=? where id=?',
        [refer_question_id, new Date().toISOString().slice(0, 19).replace('T', ' '), question_id]
    );
}

exports.getQuestions = () => {
    console.log('db_man/questions/getQuestions');
    return db.execute(
        `
        SELECT qid, user_id, keywords, related, qcreated_at, email, name, upvote, downvote
        FROM (
            SELECT q.id AS qid,
                q.user_id,
                q.question,
                q.keywords,
                q.related,
                q.refer_question_id,
                q.created_at AS qcreated_at,
                u.email,
                u.name
            FROM pharmazing.questions q
            JOIN pharmazing.users u ON q.user_id = u.id
            WHERE q.follow_up_question = 0 AND q.user_id !=5
            ORDER BY q.created_at DESC
        ) q
        LEFT JOIN pharmazing.answers a ON q.qid = a.question_id
        WHERE a.main_answer=1
        ORDER BY q.qid DESC
        `,
        // 'select * from (SELECT q.id as id, user_id, question, keywords, q.created_at as created_at, email, name FROM pharmazing.questions q join pharmazing.users u on q.user_id=u.id order by q.created_at DESC) q left join pharmazing.answers a on q.id=a.question_id order by q.id DESC',
        []
    );
}

