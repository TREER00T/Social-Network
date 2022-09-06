let dotenv = require('dotenv'),
    openSql = require('opensql');

dotenv.config();

module.exports = {

    connect(cb) {
        openSql.connect({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            charset: process.env.CHARSET,
            multipleStatements: true
        }).result((s) => {
            if (cb !== undefined)
                cb(s instanceof Error);
        });
    }

}