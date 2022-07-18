let openSql = require('opensql'),
    {
        IN
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    FindInCommon = require('app/model/find/common/common'),
    DeleteInCommon = require('app/model/remove/common/common');

module.exports = {

    chat(tableName, cb) {
        openSql.dropTable(tableName)
            .result(result => {
                try {
                    cb(result[1].affectedRows !== 0)
                } catch (e) {
                    DataBaseException(e);
                }
            });
    },

    chatInListOfChatsForUser(fromUser, toUser, userId, cb) {
        openSql.remove({
            table: 'listOfUserE2Es',
            where: {
                fromUser: fromUser,
                toUser: toUser,
                userId: userId
            }
        }).result(result => {
            try {
                cb(result[1].affectedRows !== 0)
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    removeUserInUsersBlockList(userId, id) {
        openSql.remove({
            table: 'userBlockList',
            where: {
                userTargetId: id,
                userId: userId
            }
        });
    },

    groupInListOfUserGroups(id) {
        openSql.remove({
            table: 'listOfUserGroups',
            where: {
                groupId: id
            }
        });
    },

    channelInListOfUserChannels(id) {
        openSql.remove({
            table: 'listOfUserChannels',
            where: {
                channelId: id
            }
        });
    },

    groupIntoListOfUserGroups(groupId, userId) {
        openSql.remove({
            table: 'listOfUserGroups',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    },

    channelIntoListOfUserChannels(channelId, userId) {
        openSql.remove({
            table: 'listOfUserChannels',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    },

    savedMessage(phone) {
        openSql.dropTable(phone + 'SavedMessages');
    },

    userInAllUsersBlockList(id) {
        openSql.remove({
            table: 'userBlockList',
            where: {
                userId: id
            }
        });
    },

    userInUsersTable(id) {
        openSql.remove({
            table: 'users',
            where: {
                id: id
            }
        });
    },

    userInAllUsersGroup(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['groupId']);

        });

        openSql.dropTable(arrayOfTable);
        openSql.remove({
            table: 'listOfUserGroups',
            where: {
                userId: id
            }
        });
    },

    userInAllUsersChannel(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['channelId']);

        });

        openSql.dropTable(arrayOfTable);
        openSql.remove({
            table: 'listOfUserChannels',
            where: {
                userId: id
            }
        });
    },

    userInAllUsersE2E(array, id) {
        let arrayOfTable = [];

        array.forEach(item => {

            arrayOfTable.push(item['tblChatId']);

        });

        openSql.dropTable(arrayOfTable);
        openSql.remove({
            table: 'listOfUserE2Es',
            where: {
                userId: id
            }
        });
    },

    userInDevices(id) {
        openSql.remove({
            table: 'devices',
            where: {
                userId: id
            }
        });
    },

    itemInSavedMessage(phone, listOfId) {
        listOfId.forEach(item => {
            FindInCommon.isForwardData(phone + 'SavedMessages', item, id => {
                if (id !== null)
                    DeleteInCommon.forwardMessage(id);
            });
        });
        openSql.remove({
            table: phone + 'SavedMessages',
            where: {
                id: IN(listOfId)
            }
        });
    }

}