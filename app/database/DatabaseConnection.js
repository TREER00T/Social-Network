const mysql = require('mysql'),
    dotenv = require('dotenv'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');

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


    query(sql, arrayObjects) {

        try {
            con.query(sql, arrayObjects, (err, result) => {

                (function (cb) {
                    if (typeof cb === 'function')
                        cb((err !== null) ? err : result);
                })(queryResult);

            });
        } catch (e) {
            DataBaseException(e);
        }


    },

    sqlQueryResult(callBackResult) {
        queryResult = (result => {
            callBackResult(result);
        });
    }

}