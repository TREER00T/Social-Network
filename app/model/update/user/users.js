let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    authCode(phone, authCode, cb) {
        openSql.update({
            table: 'users',
            edit: {
                authCode: authCode
            },
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    apikey(phone, key, cb) {
        openSql.update({
            table: 'users',
            edit: {
                apiKey: `${key}`
            },
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    userOnline(phone, status) {
        openSql.update({
            table: 'users',
            edit: {
                isActive: `${status}`
            },
            where: {
                phone: `${phone}`
            }
        });
    },


    username(phone, username, cb) {
        openSql.update({
            table: 'users',
            edit: {
                username: `${username}`
            },
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    bio(phone, bio, cb) {
        openSql.update({
            table: 'users',
            edit: {
                bio: `${bio}`
            },
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    name(phone, firstName, lastName, cb) {
        openSql.update({
            table: 'users',
            edit: {
                firstName: `${firstName}`,
                lastName: `${lastName}`
            },
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}