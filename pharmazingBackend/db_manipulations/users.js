const db = require('../util/database');
const bcrypt = require('bcrypt');

exports.deleteUser = (user_id) => {
    console.log('db_man/users/deleteUser');
        return db.execute(
        'update users set trial_start_date_epoch=0, trial_end_date_epoch=0, subscription_end_date_epoch=0, fcm_token="", platform="unknown", surname="", country_device="", phone_id="", tablet_id="", deleted=1, email="", lng="", password="", phonenumber="", university="", name="", city="", studies="NA", country="", reset_token="" where id=?',
        [user_id]
    );
}

exports.fetchOnEmail = (email) => {
    console.log('models/user/fetch');
    return db.execute("SELECT * FROM pharmazing.users where email=?", [email]); 
  }

exports.test = () => {
    console.log('from inside user test function');
}

exports.fetchOnId = (id) => {
    console.log('models/user/fetchOnId');
    return db.execute("SELECT * FROM pharmazing.users where id=?", [id]); 
}

exports.fetchOnPhonenumber = (phonenumber) => {
    console.log('models/user/fetchOnPhonenumber');
    return db.execute("SELECT * FROM pharmazing.users where phonenumber=?", [phonenumber]); 
}

exports.setFcmToken = (user_id, fcm_token) => {
    // console.log('db_man/users/setFcmToken');
    return db.execute(
        'UPDATE users set fcm_token=?, updated_at=? where id=?',
        [fcm_token, new Date().toISOString().slice(0, 19).replace('T', ' '), user_id]
    );
}

exports.setRefusePriceMarketing = (user_id) => {
    console.log('db_man/users/setRefusePriceMarketing');
    return db.execute(
        'UPDATE users set refuse_price_marketing=true, updated_at=? where id=?',
        [new Date().toISOString().slice(0, 19).replace('T', ' '), user_id]
    );
}

exports.setActiveSubscription = (user_id, subscription_end_date_epoch) => {
    console.log('setActiveSubscription');
    return db.execute(
        'UPDATE users set active_subscription=1, subscription_end_date=?, subscription_end_date_epoch=? where id=?',
        [new Date(subscription_end_date_epoch).toISOString().slice(0, 19).replace('T', ' '), subscription_end_date_epoch, user_id]
    );
}

// CONSTANTS
const expiryMinutesResetPassword = 15 * 60*1000;

exports.setResetToken = (email, resetToken) => {
    console.log('db_man/users/setResetToken');
    let currentTime = new Date();
    return db.execute(
        'UPDATE users set reset_token=?, reset_expiry_date=?, updated_at=? where email=?',
        [resetToken, new Date(currentTime.getTime() + expiryMinutesResetPassword).toISOString().slice(0, 19).replace('T', ' '),new Date().toISOString().slice(0, 19).replace('T', ' '), email]
    );
}

exports.setSemester = (user_id, semester) => {
    console.log('db_man/users/setSemester');
    let currentTime = new Date();
    return db.execute(
        'UPDATE users set semester=?, updated_at=? where id=?',
        [semester, new Date(currentTime.getTime()).toISOString().slice(0, 19).replace('T', ' '), user_id]
    );
}

exports.setPassword = (email, password) => {
    console.log('db_man/users/setPassword');
    return db.execute(
        'UPDATE users set password=?, reset_expiry_date=?, updated_at=? where email=?',
        [bcrypt.hashSync(password, 10), new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), email]
    );
}

exports.setTablet = (user_id, device_id) => {
    console.log('db_man/users/setTablet');
    return db.execute(
        'UPDATE users set tablet_id=?, tablet_login=?, updated_at=? where id=?',
        [device_id, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), user_id]
    );
}

exports.setPhone = (user_id, device_id) => {
    console.log('db_man/users/setTablet');
    return db.execute(
        'UPDATE users set phone_id=?, phone_login=?, updated_at=? where id=?',
        [device_id, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), user_id]
    );
}

// exports.setDevice1 = (email, device_id) => {
//     console.log('db_man/users/setDevice1');
//     return db.execute(
//         'UPDATE users set device_id_1=?, device_1_login=?, updated_at=? where email=?',
//         [device_id, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), email]
//     );
// }

// exports.setDevice2 = (email, device_id) => {
//     console.log('db_man/users/setDevice2');
//     return db.execute(
//         'UPDATE users set device_id_2=?, device_2_login=?, updated_at=? where email=?',
//         [device_id, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), email]
//     );
// }

exports.getUsers = () => {
    console.log('db_man/users/getUsers');
    return db.execute(
        'SELECT id, email, name, city, country, university, studies, created_at from users order by created_at DESC',
        []
    );
}

exports.marketing = () => {
    console.log('db_man/users/getUsers');
    return db.execute(
    `
    SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.phonenumber,
    CASE u.studies 
        WHEN 'PH' THEN 'Pharmazie'
        WHEN 'ME' THEN 'Humanmedizin'
        WHEN 'ST_ME_HUMAN' THEN 'Humanmedizin'
        WHEN 'ZM' THEN 'Zahnmedizin'
        WHEN 'ST_ME_ZM' THEN 'ZahnMedicine'
        WHEN 'TA' THEN 'Tiermedizin'
        WHEN 'PA' THEN 'PTA-Ausbildung'
        WHEN 'ST_PTA' THEN 'PTA-Ausbildung'
        WHEN 'OTHER' THEN 'Andere'
        WHEN 'NA' THEN 'Andere'
        ELSE u.studies 
    END AS studies_translated,
    u.university,
    u.created_at AS signup_date,
    CASE WHEN u.phone_id <> '' THEN 1 ELSE 0 END AS uses_phone,
    CASE WHEN u.tablet_id <> '' THEN 1 ELSE 0 END AS uses_tablet,
    COALESCE(tc.prompt_tokens_cost, 0) AS prompt_tokens_cost,
    COALESCE(tc.prompt_tokens_cost_last_7_days, 0) AS prompt_tokens_cost_7d,
    COALESCE(tc.prompt_tokens_cost_last_30_days, 0) AS prompt_tokens_cost_30d,
    COALESCE(tc.completion_tokens_cost, 0) AS completion_tokens_cost,
    COALESCE(tc.completion_tokens_cost_last_7_days, 0) AS completion_tokens_cost_7d,
    COALESCE(tc.completion_tokens_cost_last_30_days, 0) AS completion_tokens_cost_30d,
    COALESCE(qc.total_questions, 0) AS total_questions,
    COALESCE(qc.questions_7_days, 0) AS questions_7_days,
    COALESCE(qc.questions_30_days, 0) AS questions_30_days,
    COALESCE(qc.total_follow_up_questions, 0) AS follow_up_total_questions,
    COALESCE(qc.follow_up_questions_7_days, 0) AS follow_up_questions_7_days,
    COALESCE(qc.follow_up_questions_30_days, 0) AS follow_up_questions_30_days
FROM 
    users u
LEFT JOIN 
    (
        SELECT 
            user_id,
            SUM(prompt_tokens) / 1000 * 0.01 AS prompt_tokens_cost,
            SUM(completion_tokens) / 1000 * 0.03 AS completion_tokens_cost,
            SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN prompt_tokens ELSE 0 END) / 1000 * 0.01 AS prompt_tokens_cost_last_7_days,
            SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN completion_tokens ELSE 0 END) / 1000 * 0.03 AS completion_tokens_cost_last_7_days,
            SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN prompt_tokens ELSE 0 END) / 1000 * 0.01 AS prompt_tokens_cost_last_30_days,
            SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN completion_tokens ELSE 0 END) / 1000 * 0.03 AS completion_tokens_cost_last_30_days
        FROM 
            tokens
        GROUP BY 
            user_id
    ) tc ON u.id = tc.user_id
LEFT JOIN 
    (
        SELECT 
            q.user_id,
            COUNT(DISTINCT CASE WHEN q.follow_up_question = 0 THEN q.id END) AS total_questions,
            COUNT(DISTINCT CASE WHEN q.follow_up_question = 1 THEN q.id END) AS total_follow_up_questions,
            COUNT(CASE WHEN q.follow_up_question = 0 AND q.created_at >= CURDATE() - INTERVAL 7 DAY THEN 1 END) AS questions_7_days,
            COUNT(CASE WHEN q.follow_up_question = 1 AND q.created_at >= CURDATE() - INTERVAL 7 DAY THEN 1 END) AS follow_up_questions_7_days,
            COUNT(CASE WHEN q.follow_up_question = 0 AND q.created_at >= CURDATE() - INTERVAL 30 DAY THEN 1 END) AS questions_30_days,
            COUNT(CASE WHEN q.follow_up_question = 1 AND q.created_at >= CURDATE() - INTERVAL 30 DAY THEN 1 END) AS follow_up_questions_30_days
        FROM 
            questions q
        GROUP BY 
            q.user_id
		ORDER BY q.user_id
    ) qc ON u.id = qc.user_id where u.id>8;`,
        []
    );
}

exports.marketingActiveUsers = () => {
    console.log('db_man/users/marketingActiveUsers');
    return db.execute(
    `
    SELECT
        CASE u.studies
            WHEN 'ME' THEN 'medicine'
            WHEN 'ST_ME_HUMAN' THEN 'medicine'
            WHEN 'PH' THEN 'pharmacy'
            WHEN 'ST_PH' THEN 'pharmacy'
            WHEN 'PA' THEN 'PTA'
            WHEN 'BE_PTA' THEN 'PTA'
            WHEN 'ST_PTA' THEN 'PTA'
            WHEN 'ZM' THEN 'ZahnMedicine'
            WHEN 'ST_ME_ZM' THEN 'ZahnMedicine'
            WHEN 'TA' THEN 'TierArtz'
            ELSE 'OTHER'
        END AS studies_category,
        COUNT(DISTINCT CASE WHEN DATE(l.created_at) = CURRENT_DATE THEN u.id END) AS users_today,
        COUNT(DISTINCT CASE WHEN DATE(l.created_at) = CURRENT_DATE - INTERVAL 1 DAY THEN u.id END) AS users_yesterday,
        COUNT(DISTINCT CASE WHEN DATE(l.created_at) >= CURRENT_DATE - INTERVAL 7 DAY THEN u.id END) AS users_last_7_days,
        COUNT(DISTINCT CASE WHEN DATE(l.created_at) >= CURRENT_DATE - INTERVAL 30 DAY THEN u.id END) AS users_last_30_days
    FROM
        users u
    JOIN
        questions l ON u.id = l.user_id
    GROUP BY
        studies_category;`,
        []
    );
}


exports.marketingUniversities = () => {
    console.log('db_man/users/marketingUniversities');
    return db.execute(
        `
        SELECT
            CASE studies
                WHEN 'ME' THEN 'medicine'
                WHEN 'ST_ME_HUMAN' THEN 'medicine'
                WHEN 'PH' THEN 'pharmacy'
                WHEN 'ST_PH' THEN 'pharmacy'
                WHEN 'PA' THEN 'PTA'
                WHEN 'ZM' THEN 'ZahnMedicine'
                WHEN 'ST_ME_ZM' THEN 'ZahnMedicine'
                WHEN 'TA' THEN 'TierArtz'
                ELSE studies
            END AS renamed_studies,
            university,
            COUNT(*) AS people_count
        FROM users
        GROUP BY university, renamed_studies
        ORDER BY renamed_studies, university;`,
        []
    );
}
exports.averageCost7_30_days = () => {
    console.log('db_man/users/averageCost7_30_days');
    return db.execute(
    `
    -- Calculating average cost per user who signed up at least 7 days ago for the last 7 days
    SELECT
        'Last 7 days' AS period,
        AVG(cost) AS average_cost
    FROM (
        SELECT
            u.id AS user_id,
            (SUM(t.prompt_tokens) / 1000 * 0.01 + SUM(t.completion_tokens) / 1000 * 0.03) AS cost
        FROM
            users u
        JOIN
            tokens t ON u.id = t.user_id
        WHERE
            u.created_at <= CURDATE() - INTERVAL 7 DAY
            AND t.created_at >= CURDATE() - INTERVAL 7 DAY
            AND u.id>8
        GROUP BY
            u.id
    ) AS costs_7_days
    
    UNION ALL
    
    -- Calculating average cost per user who signed up at least 30 days ago for the last 30 days
    SELECT
        'Last 30 days' AS period,
        AVG(cost) AS average_cost
    FROM (
        SELECT
            u.id AS user_id,
            (SUM(t.prompt_tokens) / 1000 * 0.01 + SUM(t.completion_tokens) / 1000 * 0.03) AS cost
        FROM
            users u
        JOIN
            tokens t ON u.id = t.user_id
        WHERE
            u.created_at <= CURDATE() - INTERVAL 30 DAY
            AND t.created_at >= CURDATE() - INTERVAL 30 DAY
            AND u.id>8
        GROUP BY
            u.id
    ) AS costs_30_days;
    `,
        []
    );
}