let openSql = require('opensql'),
    {
        EQUAL_TO
    } = openSql.queryHelper,
    {
        AND,
        STAR,
        COUNT
    } = openSql.keywordHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    channelId(id, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'channels', 'id', `${id}`],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isPublicKeyUsed(publicLink, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'channels', 'publicLink', `${publicLink}`],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwnerOfChannel(adminId, channelId, cb) {
        let isOwner = 1;
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'channelsAdmins',
                'adminId', `${adminId}`,
                'channelId', `${channelId}`,
                'isOwner', isOwner
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwnerOrAdminOfChannel(adminId, channelId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
            ],
            data: [
                'id', 'channelsAdmins',
                'adminId', `${adminId}`,
                'channelId', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isJoinedInChannel(channelId, userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'channelsUsers', 'userId',
                `${userId}`, 'channelId', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isUserAdminOfChannel(channelId, userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'channelsAdmins', 'userId',
                `${userId}`, 'channelId', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getCountOfListMessage(channelId, cb) {
        openSql.find({
            optKey: [
                COUNT
            ],
            data: [
                '`' + channelId + 'ChannelContents`'
            ]
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getChannelInfo(channelId, cb) {
        openSql.find({
            optKey: [
                STAR,
                EQUAL_TO
            ],
            data: ['channels', 'id', `${channelId}`],
            where: true
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getCountOfUserInChannel(channelId, cb) {
        openSql.find({
            optKey: [
                COUNT,
                EQUAL_TO
            ],
            data: [
                'channels', 'id', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getAllUsersForChannel(channelId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: [
                'userId', 'channelsUsers', 'channelId', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                (result[1].length !== 0) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getDataForChannelContentWithId(id, cb) {
        openSql.find({
            optKey: [
                STAR,
                EQUAL_TO
            ],
            data: [
                '`' + id + 'ChannelContents`', 'id', `${id}`
            ],
            where: true
        }).result(result => {
            try {
                (result[1][0] !== undefined) ? cb(result[1][0]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}