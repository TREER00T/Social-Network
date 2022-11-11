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
                from: 'groups',
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
                from: 'groups',
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

    async isOwner(adminId, groupId) {

        return new Promise(res => {

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
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isJoined(groupId, userId) {

        return new Promise(res => {


            openSql.find({
                get: 'id',
                from: 'groupsUsers',
                where: {
                    userId: `${userId}`,
                    groupId: `${groupId}`
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

    async isAdmin(groupId, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'groupsAdmins',
                where: {
                    userId: `${userId}`,
                    groupId: `${groupId}`
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

    async getCountOfListMessage(groupId) {

        return new Promise(res => {

            openSql.find({
                get: COUNT,
                from: '`' + groupId + 'GroupContents`'
            }).result(result => {
                try {
                    res(result[0].size);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getInfo(groupId) {

        return new Promise(res => {

            openSql.find({
                get: STAR,
                from: 'groups',
                where: {
                    id: `${groupId}`
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


    async getCountOfUsers(groupId) {

        return new Promise(res => {

            openSql.find({
                get: COUNT,
                from: 'groups',
                where: {
                    id: `${groupId}`
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

    async getAllUsers(groupId) {

        return new Promise(res => {

            openSql.find({
                get: 'userId',
                from: 'groupsUsers',
                where: {
                    groupId: `${groupId}`
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
                from: '`' + id + 'GroupContents`',
                where: {
                    id: `${id}`
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