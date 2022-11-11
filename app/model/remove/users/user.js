let openSql = require('opensql'),
    {
        IN
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('../../../exception/DataBaseException'),
    {
        isUndefined,
        isBiggerThanZero
    } = require('../../../util/Util'),
    FindInCommon = require('../../../model/find/common/common'),
    DeleteInCommon = require('../../../model/remove/common/common');

module.exports = {

    async chat(tableName) {

        return new Promise(res => {

            openSql.dropTable(tableName).result(result => {
                try {
                    res(isBiggerThanZero(result[1]?.affectedRows))
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async chatInListOfChatsForUser(fromUser, toUser, userId) {
        await openSql.remove({
            table: 'listOfUserE2Es',
            where: {
                fromUser: fromUser,
                toUser: toUser,
                userId: userId
            }
        });
    },

    async removeUserInUsersBlockList(userId, id) {
        await openSql.remove({
            table: 'userBlockList',
            where: {
                userTargetId: id,
                userId: userId
            }
        });
    },

    async groupInListOfUserGroups(id) {
        await openSql.remove({
            table: 'listOfUserGroups',
            where: {
                groupId: id
            }
        });
    },

    async channelInListOfUserChannels(id) {
        await openSql.remove({
            table: 'listOfUserChannels',
            where: {
                channelId: id
            }
        });
    },

    async groupIntoListOfUserGroups(groupId, userId) {
        await openSql.remove({
            table: 'listOfUserGroups',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    },

    async channelIntoListOfUserChannels(channelId, userId) {
        await openSql.remove({
            table: 'listOfUserChannels',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    },

    async savedMessage(phone) {
        await openSql.dropTable(phone + 'SavedMessages');
    },

    async userInAllUsersBlockList(id) {
        await openSql.remove({
            table: 'userBlockList',
            where: {
                userId: id
            }
        });
    },

    async userInUsersTable(id) {
        await openSql.remove({
            table: 'users',
            where: {
                id: id
            }
        });
    },

    async userInAllUsersGroup(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['groupId']);

        });

        await openSql.dropTable(arrayOfTable);
        await openSql.remove({
            table: 'listOfUserGroups',
            where: {
                userId: id
            }
        });
    },

    async userInAllUsersChannel(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['channelId']);

        });

        await openSql.dropTable(arrayOfTable);
        await openSql.remove({
            table: 'listOfUserChannels',
            where: {
                userId: id
            }
        });
    },

    async userInAllUsersE2E(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['tblChatId']);

        });

        await openSql.dropTable(arrayOfTable);
        await openSql.remove({
            table: 'listOfUserE2Es',
            where: {
                userId: id
            }
        });
    },

    async userInDevices(id) {
        await openSql.remove({
            table: 'devices',
            where: {
                userId: id
            }
        });
    },

    async itemInSavedMessage(phone, listOfId) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(phone + 'SavedMessages', item);
            if (!isUndefined(id))
                await DeleteInCommon.forwardMessage(id);
        }

        await openSql.remove({
            table: phone + 'SavedMessages',
            where: {
                id: IN(listOfId)
            }
        });

    }

}