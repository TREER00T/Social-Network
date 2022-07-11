let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    {
        NULL
    } = openSql.queryHelper;


module.exports = {

    img(id, url, cb) {
        openSql.update({
            table: 'channels',
            edit: {
                img: `${url}`
            },
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    name(id, name, cb) {
        openSql.update({
            table: 'channels',
            edit: {
                name: `${name}`
            },
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    description(id, description = NULL, cb) {
        openSql.update({
            table: 'channels',
            edit: {
                description: `${description}`
            },
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    inviteLink(id, link, cb) {
        openSql.update({
            table: 'channels',
            edit: {
                inviteLink: `${link}`,
                publicLink: NULL
            },
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    publicLink(id, link, cb) {
        openSql.update({
            table: 'channels',
            edit: {
                inviteLink: NULL,
                publicLink: `${link}`
            },
            where: {
                id: `${id}`
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