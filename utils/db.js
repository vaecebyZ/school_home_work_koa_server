// db.js 
let mysql = require('mysql');
 
const { options_mysql } = require('../config/settings')
 
let pool = mysql.createPool({
    host: options_mysql.host,
    user: options_mysql.user,
    password: options_mysql.password,
    database: options_mysql.database
});
 
function query(sql) {
    console.log(sql)
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
                connection.release();
            });
        });
    })
 
}
 
exports.query = query;