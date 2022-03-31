const mysql = require('mysql'),
    dotenv = require('dotenv');

dotenv.config();

let queryResult;

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    charset: process.env.CHARSET,
    multipleStatements: true
});

module.exports = {

    query(sql, arrayObjects, throwErr) {
        con.connect((err) => {
            (function (cb) {
                if (typeof cb === 'function')
                    cb((err !== undefined) ? err : '');
            })(queryResult);
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
        });
    },

    sqlQueryResult(callBackResult) {
        queryResult = ((result) => {
            callBackResult(result);
        });
    }
}