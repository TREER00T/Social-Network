let openSql = require('opensql'),
    {
        DataBaseException
    } = require('../../../exception/DataBaseException'),
    {
        isBiggerThanZero
    } = require('../../../util/Util'),
    {
        NULL
    } = openSql.queryHelper;


module.exports = {

    async authCode(phone, authCode) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async apikey(phone, key) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async userOnline(phone, status) {
        await openSql.update({
            table: 'users',
            edit: {
                isActive: `${status}`
            },
            where: {
                phone: `${phone}`
            }
        });
    },


    async username(phone, username) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async bio(phone, bio = NULL) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async name(phone, firstName, lastName) {

        return new Promise(res => {

            try {
                if (typeof lastName === 'string')
                    lastName = lastName.toString().trim();
            } catch (e) {
            }

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async passwordAndEmail(phone, password, email) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async password(phone, password) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async img(phone, url) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async itemInSavedMessage(phone, id) {
        await openSql.update({
            table: phone + 'SavedMessages',
            where: {
                id: id
            }
        });
    }

}