const mysql = require('mysql2');

// if(typeof process.env.MODE === 'undefined' || process.env.MODE=='prod') {
//     const pool = mysql.createPool({
//         host: '127.0.0.1',
//         //host: 'localhost',
//         user: 'node',
//         database: 'pharmazing',
//         password: '12345678'
//     }); 
//     module.exports = pool.promise();
// } else {


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD
});
module.exports = pool.promise();
