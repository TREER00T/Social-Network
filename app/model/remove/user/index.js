let {
        user,
        device,
        userBlockList,
        listOfUserE2E,
        listOfUserGroup,
        listOfUserChannel
    } = require('../../create/user'),
    {dropCollection} = require('../../../database/mongoDbDriverConnection'),
    FindInCommon = require('../../find/common'),
    DeleteInCommon = require('../../remove/common'),
    {deleteMany} = require('../../../database/mongoDbDriverConnection'),
    {isUndefined} = require('../../../Util/Util');

module.exports = {

    async chat(tableName) {

        await dropCollection(tableName);

    },

    async chatInListOfE2EChat(fromUser, toUser, userId) {

        await listOfUserE2E().deleteOne({
            fromUser: fromUser,
            toUser: toUser,
            userId: userId
        });

    },

    async userInUsersBlockList(userId, id) {

        await userBlockList().deleteOne({
            userTargetId: id,
            userId: userId
        });

    },

    async groupInListOfUserGroup(id) {

        await listOfUserGroup().deleteMany({
            groupId: id
        });

    },

    async channelInListOfUserChannel(id) {

        await listOfUserChannel().deleteMany({
            channelId: id
        });

    },

    async groupIntoListOfUserGroup(groupId, userId) {

        await listOfUserGroup().deleteOne({
            groupId: groupId,
            userId: userId
        });

    },

    async channelIntoListOfUserChannel(channelId, userId) {

        await listOfUserChannel().deleteOne({
            channelId: channelId,
            userId: userId
        });

    },

    async savedMessage(phone) {

        await dropCollection(`${phone}SavedMessage`);

    },

    async userInAllUsersBlockList(id) {

        await userBlockList().deleteMany({
            userId: id
        });

    },

    async userInUsersTable(id) {

        await user().findByIdAndDelete(id);

    },

    async userInAllUsersGroup(array, id) {

        array.map(e => e.groupId);

        await dropCollection(array);

        await listOfUserGroup().deleteMany({
            userId: id
        });

    },

    async userInAllUsersChannel(array, id) {

        array.map(e => e.channelId);

        await dropCollection(array);

        await listOfUserChannel().deleteMany({
            userId: id
        });

    },

    async userInAllUsersE2E(array, id) {

        array.map(e => e.tblChatId);

        await dropCollection(array);

        await listOfUserE2E().deleteMany({
            userId: id
        });

    },

    async userInDevices(id) {

        await device().deleteMany({
            userId: id
        });

    },

    async itemInSavedMessage(phone, listOfId) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(`${phone}SavedMessages`, item);

            if (!isUndefined(id))
                await DeleteInCommon.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, `${phone}SavedMessage`);

    }

}