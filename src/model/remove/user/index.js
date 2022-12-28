let {
        user,
        device,
        userBlockList,
        listOfUserE2E,
        listOfUserGroup,
        listOfUserChannel
    } = require('../../create/user'),
    {dropCollection, deleteMany} = require('../../../database/mongoDbDriverConnection'),
    FindInCommon = require('../../find/common'),
    DeleteInCommon = require('../../remove/common'),
    {isUndefined} = require('../../../Util/Util');

module.exports = {

    async chat(tableName) {

        await dropCollection(tableName);

    },

    async chatInListOfE2EChat(fromUser, toUser, userId) {

        await listOfUserE2E().deleteOne({
            fromUser: fromUser, toUser: toUser, userId: userId
        });

    },

    async userInUsersBlockList(userId, id) {

        await userBlockList().deleteOne({
            userTargetId: id, userId: userId
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
            groupId: groupId, userId: userId
        });

    },

    async channelIntoListOfUserChannel(channelId, userId) {

        await listOfUserChannel().deleteOne({
            channelId: channelId, userId: userId
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

        // Drop user created group
        array.map(async e => await dropCollection(e.groupId));

        await listOfUserGroup().deleteMany({
            userId: id
        });

    },

    async userInAllUsersChannel(array, id) {

        // Drop user created channel
        array.map(async e => await dropCollection(e.channelId));

        await listOfUserChannel().deleteMany({
            userId: id
        });

    },

    async userDataInJoinedChannels(arr, userId) {
        // Delete the list of messages of any channel sent by the user
        for (const item of arr) {
            await deleteMany({
                senderId: userId
            }, `${item.channelId}ChannelContents`);
        }
    },

    async userDataInJoinedGroups(arr, userId) {
        // Delete the list of messages of any group sent by the user
        for (const item of arr) {
            await deleteMany({
                senderId: userId
            }, `${item.groupId}GroupContents`);
        }
    },

    async userInAllUsersE2E(array, id) {

        array.map(async e => await dropCollection(e.tblChatId));

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
            let id = await FindInCommon.isForwardData(`${phone}SavedMessage`, item);

            if (!isUndefined(id))
                await DeleteInCommon.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, `${phone}SavedMessage`);

    }

}