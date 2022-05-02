let openSql = require('app/database/OpenSql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    authCode(phone, authCode, cb) {
        openSql.update({
            table: 'users',
            editField: {
                authCode: authCode
            },
            where: {
                phone: `${phone}`
            }
        }).result((result) => {
            try {
                (result[1].changedRows !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        })
    },


    apikey(phone, key, cb) {
        openSql.update({
            table: 'users',
            editField: {
                apiKey: `${key}`
            },
            where: {
                phone: `${phone}`
            }
        }).result((result) => {
            try {
                (result[1].changedRows !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        })
    }

}