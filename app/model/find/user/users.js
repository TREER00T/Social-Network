let openSql = require('app/database/OpenSql'),
    {
        EQUAL_TO
    } = require('app/database/util/SqlKeyword');


module.exports = {

    userPhone(phone, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: ['phone', 'users', 'phone', `${phone}`],
            where: true
        }).result((result) => {
            (result[1].length !== 0) ? cb(true) : cb(false)
        })
    },

    isValidAuthCode(phone, authCode, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: [
                ['phone', 'authCode'], 'users', 'phone',
                `${phone}`, 'authCode', `${authCode}`
            ],
            where: true
        }).result((result) => {
            (result.length > 0) ? cb(true) : cb(false);
        });
    },

    password(phone, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: [
                'password', 'users', 'phone', `${phone}`
            ],
            where: true
        }).result((result) => {
            (result[1][0].password === null) ? cb(true) : cb(false);
        });
    }

}