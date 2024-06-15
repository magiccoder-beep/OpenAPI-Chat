const db = require('../util/database');

exports.fetchMessagesHistory = async (user_id) => {
    const sql = `
        SELECT role, content, question_id, created_at 
        FROM pharmazing.messages 
        WHERE user_id=? 
        ORDER BY question_id DESC, id ASC`;
    
    // onst sql = `SELECT role, content, question_id, created_at FROM pharmazing.messages where user_id=? order by question_id DESC, id ASC`;

    try {
        return db.execute(sql, [user_id]); 
    } catch (error) {
        console.error("Error fetching messages based on user_id:"+user_id, error);
        throw error;
    }
};

exports.fetchMessagesQuestion = async (question_id) => {
    console.log('fetchMessagesQuestion')
    const sql = `
        SELECT * FROM pharmazing.messages where question_id=? order by id;
        `;
    
    // onst sql = `SELECT role, content, question_id, created_at FROM pharmazing.messages where user_id=? order by question_id DESC, id ASC`;

    try {
        return db.execute(sql, [question_id]); 
    } catch (error) {
        console.error("Error fetching messages based on question_id:"+question_id, error);
        throw error;
    }
}

exports.fetchHistoryQuestions = async (user_id) => {
    const sql = `
        SELECT m.role, m.content, m.question_id, m.created_at
            FROM pharmazing.messages m
        INNER JOIN (
            SELECT question_id, MIN(created_at) AS min_created_at
            FROM pharmazing.messages
            WHERE user_id = ? AND role = 'user'
            GROUP BY question_id
        ) subq ON m.question_id = subq.question_id AND m.created_at = subq.min_created_at
        WHERE m.user_id = ? AND m.role = 'user'
        ORDER BY m.question_id DESC;
        `;
    try {
        return db.execute(sql, [user_id, user_id]); 
    } catch (error) {
        console.error("Error fetching messages based on user_id:"+user_id, error);
        throw error;
    }
};

exports.fetchMessagesHistoryAdmin = async () => {
    const sql = `
    SELECT 
    q.qid, 
    q.user_id, 
    q.keywords, 
    q.related, 
    q.qcreated_at as created_at, 
    q.email, 
    q.name, 
    q.upvote, 
    q.downvote, 
    m.role, 
    m.content
FROM (
    SELECT 
        q.id AS qid,
        q.user_id,
        q.keywords,
        q.related,
        q.created_at AS qcreated_at,
        u.email,
        u.name,
        a.upvote,
        a.downvote
    FROM pharmazing.questions q
    JOIN pharmazing.users u ON q.user_id = u.id
    LEFT JOIN pharmazing.answers a ON q.id = a.question_id AND a.main_answer = 1
    WHERE q.follow_up_question = 0 AND q.created_at >= CURDATE() - INTERVAL 3 DAY AND q.user_id!=5
    ORDER BY q.created_at DESC
) q
LEFT JOIN (
    SELECT 
        role, 
        content, 
        question_id, 
        created_at,
        id as mid
    FROM pharmazing.messages
) m ON q.qid = m.question_id
ORDER BY q.qid DESC, m.question_id DESC, m.mid ASC`;
    // SELECT role, content, question_id, created_at FROM pharmazing.messages order by question_id DESC, id ASC`;

    try {
        return db.execute(sql, []); 
    } catch (error) {
        console.error("Error fetching messages history admin", error);
        throw error;
    }
};

exports.fetchMessagesHistoryDownvote = async () => {
    const sql = `
    SELECT 
    q.qid, 
    q.user_id, 
    q.keywords, 
    q.related, 
    q.qcreated_at as created_at, 
    q.email, 
    q.name, 
    q.upvote, 
    q.downvote, 
    m.role, 
    m.content
FROM (
    SELECT 
        q.id AS qid,
        q.user_id,
        q.keywords,
        q.related,
        q.created_at AS qcreated_at,
        u.email,
        u.name,
        a.upvote,
        a.downvote
    FROM pharmazing.questions q
    JOIN pharmazing.users u ON q.user_id = u.id
    LEFT JOIN pharmazing.answers a ON q.id = a.question_id AND a.main_answer = 1
    WHERE q.follow_up_question = 0 AND a.downvote>0
    ORDER BY q.created_at DESC
) q
LEFT JOIN (
    SELECT 
        role, 
        content, 
        question_id, 
        created_at,
        id as mid
    FROM pharmazing.messages
) m ON q.qid = m.question_id
ORDER BY q.qid DESC, m.question_id DESC, m.mid ASC`;
    // SELECT role, content, question_id, created_at FROM pharmazing.messages order by question_id DESC, id ASC`;

    try {
        return db.execute(sql, []); 
    } catch (error) {
        console.error("Error fetching messages admin history downvote", error);
        throw error;
    }
};