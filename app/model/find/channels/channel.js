let openSql = require('opensql'),
    {
        STAR,
        COUNT
    } = openSql.keywordHelper,
    {
        isUndefined,
        isNotEmptyArr
    } = require('../../../util/Util'),
    {
        DataBaseException
    } = require('../../../exception/DataBaseException');


module.exports = {

    async id(id) {
        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'channels',
                where: {
                    id: `${id}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });
    },

    async isPublicKeyUsed(publicLink) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'channels',
                where: {
                    publicLink: `${publicLink}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isOwner(adminId, channelId) {
        return new Promise(res => {

            let isOwner = 1;
            openSql.find({
                get: 'id',
                from: 'channelsAdmins',
                where: {
                    adminId: `${adminId}`,
                    channelId: `${channelId}`,
                    isOwner: isOwner
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });
    },

    async isOwnerOrAdmin(adminId, channelId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'channelsAdmins',
                where: {
                    adminId: `${adminId}`,
                    channelId: `${channelId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isJoined(channelId, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'channelsUsers',
                where: {
                    userId: `${userId}`,
                    channelId: `${channelId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isAdmin(channelId, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'channelsAdmins',
                where: {
                    userId: `${userId}`,
                    channelId: `${channelId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getCountOfListMessage(channelId,) {

        return new Promise(res => {

            openSql.find({
                get: COUNT,
                from: '`' + channelId + 'ChannelContents`'
            }).result(result => {
                try {
                    res(result[0].size);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getInfo(channelId) {

        return new Promise(res => {


            openSql.find({
                get: STAR,
                from: 'channels',
                where: {
                    id: `${channelId}`
                }
            }).result(result => {
                try {
                    res(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getCountOfUsers(channelId) {

        return new Promise(res => {

            openSql.find({
                get: COUNT,
                from: 'channels',
                where: {
                    id: `${channelId}`
                }
            }).result(result => {
                try {
                    res(result[0].size);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getAllUsers(channelId) {

        return new Promise(res => {

            openSql.find({
                get: 'userId',
                from: 'channelsUsers',
                where: {
                    channelId: `${channelId}`
                }
            }).result(result => {
                try {
                    isNotEmptyArr(result[1]) ? res(result[1]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getDataWithId(id) {

        return new Promise(res => {

            openSql.find({
                get: STAR,
                from: '`' + id + 'ChannelContents`',
                where: {
                    channelId: `${id}`
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]) ? res(result[1][0]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    }

}