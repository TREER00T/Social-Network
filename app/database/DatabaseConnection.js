const mysql = require('mysql'),
    dotenv = require('dotenv');

let queryResult;

dotenv.config();

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    charset: process.env.CHARSET,
    multipleStatements: true
});

module.exports = {


    query(sql, arrayObjects, throwErr) {

        try {
            con.query(sql, arrayObjects, (err, result) => {

                (function (cb) {
                    if (typeof cb === 'function')
                        cb((err !== null) ? err : result);
                })(queryResult);

            });
        } catch (e) {
            throw new Error(throwErr);
        }


    },

    sqlQueryResult(callBackResult) {
        queryResult = ((result) => {
            callBackResult(result);
        });
    }
}