let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');

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

    removeUserInUsersBlockList(id) {
        openSql.remove({
            table: 'userBlockList',
            where: {
                id: id
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
    }

}