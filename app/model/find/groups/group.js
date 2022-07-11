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

    groupId(id, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'groups', 'id', `${id}`],
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
            data: ['id', 'groups', 'publicLink', `${publicLink}`],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwnerOfGroup(adminId, groupId, cb) {
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
                'id', 'groupsAdmins',
                'adminId', `${adminId}`,
                'groupId', `${groupId}`,
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

    isJoinedInGroup(groupId, userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'groupsUsers', 'userId',
                `${userId}`, 'groupId', `${groupId}`
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

    isUserAdminOfGroup(groupId, userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'groupsAdmins', 'userId',
                `${userId}`, 'groupId', `${groupId}`
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

    getCountOfListMessage(groupId, cb) {
        openSql.find({
            optKey: [
                COUNT
            ],
            data: [
                '`' + groupId + 'GroupContents`'
            ]
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getGroupInfo(groupId, cb) {
        openSql.find({
            optKey: [
                STAR,
                EQUAL_TO
            ],
            data: ['groups', 'id', `${groupId}`],
            where: true
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getCountOfUserInGroup(groupId, cb) {
        openSql.find({
            optKey: [
                COUNT,
                EQUAL_TO
            ],
            data: [
                'groups', 'id', `${groupId}`
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

    getAllUsersForGroup(groupId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: [
                'userId', 'groupsUsers', 'groupId', `${groupId}`
            ],
            where: true
        }).result(result => {
            try {
                (result[1].length !== 0) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}