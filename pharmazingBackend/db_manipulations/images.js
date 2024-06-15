const db = require('../util/database');

// exports.getImages = (words) => {
//     console.log('models/images/getImages');
//     return db.execute("SELECT * FROM pharmazing.images where german LIKE '%?%'", [words[0]]); 
// }
exports.getImages = (words) => {
    console.log('models/images/getImages');
    // Check if there are no words provided
    if (words.length === 0) {
        return Promise.resolve([]); // or handle the case as you need
    }

    for(let i=0; i<words.length; i++) {
        words[i] = words[i].replace(/[()\-.,\s]/g, "");
    }

    // Start of the SQL query
    let sql = "SELECT english, MIN(type) as type, MIN(german) as german, MIN(image1) AS image1,  MAX(cid) AS cid, MIN(image2) AS image2,MIN(caption1) AS caption1, MIN(caption2) AS caption2 FROM pharmazing.images WHERE ";

    // Add LIKE conditions for each word in the array
    const likeClauses = words.map(word => `german COLLATE utf8mb4_german2_ci LIKE ?`);
    sql += likeClauses.join(' OR ');
    sql += ' GROUP BY english;'

    // Prepare the array of values for placeholders
    const queryParams = words.map(word => `%${word}%`);

    // Execute the SQL query with all parameters
    return db.execute(sql, queryParams);
}
