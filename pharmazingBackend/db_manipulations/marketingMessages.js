const db = require('../util/database');

exports.fetchNextMarketingMessage = async (user_id, types, platform='APP') => {
    console.log('fetchNextMarketingMessage')
    const placeholders = types.map(() => '?').join(', ');

    const sql = `
    SELECT mm.* 
    FROM pharmazing.marketingMessages AS mm
    JOIN pharmazing.users AS u ON mm.user_id = u.id
    WHERE mm.user_id = ? 
      AND mm.delivered = 0
      AND type IN (${placeholders})
      AND (mm.platform = ? || mm.platform = 'ANY')
      AND (u.refuse_price_marketing = false OR mm.type NOT IN ('POPUP_PRICE', 'QUESTION_PRICE'))
    ORDER BY mm.id;
    `;

    try {
        return db.execute(sql, [user_id, ...types, platform]); 
    } catch (error) {
        console.error("Error fetching marketing messages based on user_id:"+user_id, error);
        throw error;
    }
}

exports.deliveredMarketingMessage = async (user_id, id, question_id) => {
    const sql = `
        UPDATE pharmazing.marketingMessages SET question_id=?, delivered=1, delivered_at=? where id=? and user_id=? order by id;
        `;

    try {
        return db.execute(sql, [question_id, new Date().toISOString().slice(0, 19).replace('T', ' '), id, user_id]); 
    } catch (error) {
        console.error("Error deliveredMarketingMessage id:"+id, error);
        throw error;
    }
}


exports.clickedMarketingMessage = async (user_id, id) => {
    console.log('clickedMarketingMessage')
    console.log(user_id)
    console.log(id)
    const sql = `
        UPDATE pharmazing.marketingMessages SET clicked=1, clicked_at=? where id=? and user_id=? order by id;
        `;

    try {
        return db.execute(sql, [new Date().toISOString().slice(0, 19).replace('T', ' '), id, user_id]); 
    } catch (error) {
        console.error("Error deliveredMarketingMessage id:"+id, error);
        throw error;
    }
}

exports.setPrice = async (user_id, id, price, state) => {
    console.log('setPrice')
    const sql = `
        UPDATE pharmazing.marketingMessages SET price=?, clicked=1, clicked_at=?, state=? where id=? AND user_id=? AND state!='REFUSED' order by id;
        `;

    try {
        return db.execute(sql, [price, new Date().toISOString().slice(0, 19).replace('T', ' '), state, id, user_id]); 
    } catch (error) {
        console.error("Error deliveredMarketingMessage id:"+id, error);
        throw error;
    }
}

exports.refusePriceProposal = async (user_id, id) => {
    console.log('clickedMarketingMessage')
    console.log(user_id)
    console.log(id)
    const sql = `
        UPDATE pharmazing.marketingMessages SET clicked=1, clicked_at=?, state='REFUSED' where id=? and user_id=? order by id;
        `;

    try {
        return db.execute(sql, [new Date().toISOString().slice(0, 19).replace('T', ' '), id, user_id]); 
    } catch (error) {
        console.error("Error deliveredMarketingMessage id:"+id, error);
        throw error;
    }
}