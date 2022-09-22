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
            from: 'groups',
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
            from: 'groups',
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

    isOwner(adminId, groupId, cb) {
        let isOwner = 1;
        openSql.find({
            get: 'id',
            from: 'groupsAdmins',
            where: {
                adminId: `${adminId}`,
                groupId: `${groupId}`,
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

    isJoined(groupId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'groupsUsers',
            where: {
                userId: `${userId}`,
                groupId: `${groupId}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isAdmin(groupId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'groupsAdmins',
            where: {
                userId: `${userId}`,
                groupId: `${groupId}`
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getCountOfListMessage(groupId, cb) {
        openSql.find({
            get: COUNT,
            from: '`' + groupId + 'GroupContents`'
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getInfo(groupId, cb) {
        openSql.find({
            get: STAR,
            from: 'groups',
            where: {
                id: `${groupId}`
            }
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getCountOfUsers(groupId, cb) {
        openSql.find({
            get: COUNT,
            from: 'groups',
            where: {
                id: `${groupId}`
            }
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getAllUsers(groupId, cb) {
        openSql.find({
            get: 'userId',
            from: 'groupsUsers',
            where: {
                groupId: `${groupId}`
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
            from: '`' + id + 'GroupContents`',
            where: {
                id: `${id}`
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