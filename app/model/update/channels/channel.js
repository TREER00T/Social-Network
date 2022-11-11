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

    async img(id, url) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async name(id, name) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async description(id, description = NULL) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async inviteLink(id, link) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async publicLink(id, link) {

        return new Promise(res => {

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
                    res(isBiggerThanZero(result[1]?.changedRows));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    }

}