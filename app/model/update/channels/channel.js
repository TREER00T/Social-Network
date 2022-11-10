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
                cb(isBiggerThanZero(result[1]?.changedRows));
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
                cb(isBiggerThanZero(result[1]?.changedRows));
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
                cb(isBiggerThanZero(result[1]?.changedRows));
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
                cb(isBiggerThanZero(result[1]?.changedRows));
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
                cb(isBiggerThanZero(result[1]?.changedRows));
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}