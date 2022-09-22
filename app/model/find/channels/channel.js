let openSql = require('opensql'),
    {
        STAR,
        COUNT
    } = openSql.keywordHelper,
    {
        isUndefined,
        isNotEmptyArr
    } = require('app/util/Util'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    id(id, cb) {
        openSql.find({
            get: 'id',
            from: 'channels',
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isPublicKeyUsed(publicLink, cb) {
        openSql.find({
            get: 'id',
            from: 'channels',
            where: {
                publicLink: `${publicLink}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwner(adminId, channelId, cb) {
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
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwnerOrAdmin(adminId, channelId, cb) {
        openSql.find({
            get: 'id',
            from: 'channelsAdmins',
            where: {
                adminId: `${adminId}`,
                channelId: `${channelId}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isJoined(channelId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'channelsUsers',
            where: {
                userId: `${userId}`,
                channelId: `${channelId}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isAdmin(channelId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'channelsAdmins',
            where: {
                userId: `${userId}`,
                channelId: `${channelId}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getCountOfListMessage(channelId, cb) {
        openSql.find({
            get: COUNT,
            from: '`' + channelId + 'ChannelContents`'
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getInfo(channelId, cb) {
        openSql.find({
            get: STAR,
            from: 'channels',
            where: {
                id: `${channelId}`
            }
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getCountOfUsers(channelId, cb) {
        openSql.find({
            get: COUNT,
            from: 'channels',
            where: {
                id: `${channelId}`
            }
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getAllUsers(channelId, cb) {
        openSql.find({
            get: 'userId',
            from: 'channelsUsers',
            where: {
                channelId: `${channelId}`
            }
        }).result(result => {
            try {
                isNotEmptyArr(result[1]) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getDataWithId(id, cb) {
        openSql.find({
            get: STAR,
            from: '`' + id + 'ChannelContents`',
            where: {
                channelId: `${id}`
            }
        }).result(result => {
            try {
                !isUndefined(result[1][0]) ? cb(result[1][0]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}