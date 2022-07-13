let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    {
        NULL
    } = openSql.queryHelper;


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


    bio(phone, bio = NULL, cb) {
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
                name: `${firstName}`,
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
    },

    passwordAndEmail(phone, password, email, cb) {
        openSql.update({
            table: 'users',
            edit: {
                password: `${password}`,
                email: `${email}`
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

    password(phone, password, cb) {
        openSql.update({
            table: 'users',
            edit: {
                password: `${password}`
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

    img(phone, url, cb) {
        openSql.update({
            table: 'users',
            edit: {
                img: `${url}`
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

    itemInSavedMessage(phone, id) {
        openSql.update({
            table: phone + 'SavedMessages',
            where: {
                id: id
            }
        });
    }

}