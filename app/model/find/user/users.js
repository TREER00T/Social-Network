let openSql = require('app/database/OpenSql'),
    {
        AND,
        EQUAL_TO,
        IS_NOT_NULL
    } = require('app/database/util/SqlKeyword'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    userPhone(phone, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: ['phone', 'users', 'phone', `${phone}`],
            where: true
        }).result((result) => {
            try {
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        })
    },

    isValidAuthCode(phone, authCode, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                ['phone', 'authCode'], 'users', 'phone',
                `${phone}`, 'authCode', `${authCode}`
            ],
            where: true
        }).result((result) => {
            try {
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    password(phone, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO,
                AND,
                IS_NOT_NULL
            ],
            data: [
                'password', 'users', 'phone', `${phone}`,
                'password'
            ],
            where: true
        }).result((result) => {
            try {
                (result[1][0].password !== null || '' ) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isValidPassword(phone, password, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'password', 'users', 'phone',
                `${phone}`, 'password', `${password}`
            ],
            where: true
        }).result((result) => {
            try {
                (typeof result[1][0] !== 'undefined') ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getApiKey(phone, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: [
                'apiKey', 'users', 'phone', `${phone}`
            ],
            where: true
        }).result((result) => {
            try {
                cb(result[1][0].apiKey);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }


}