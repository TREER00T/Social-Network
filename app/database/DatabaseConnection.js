let dotenv = require('dotenv'),
    openSql = require('opensql');

dotenv.config();

module.exports = {

    connect() {
        openSql.connect({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            charset: process.env.CHARSET,
            multipleStatements: true
        });
    }

}