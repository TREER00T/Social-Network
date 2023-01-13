let {
        user,
        device,
        userBlockList,
        listOfUserE2E,
        listOfUserGroup,
        listOfUserChannel
    } = require('../../create/user'),
    {
        deleteMany,
        dropCollection
    } = require('../../../database/mongoDbDriverConnection');
import FindInCommon from '../../../model/find/common';
import DeleteInCommon from '../../../model/remove/common';
import {ListOfChannelId, ListOfGroupId, ListOfUserTableChat} from "../../../util/Types";


export default {

    async chat(tableName: string) {

        await dropCollection(tableName);

    },

    async chatInListOfE2EChat(fromUser: string, toUser: string, userId: string) {

        await listOfUserE2E().deleteOne({
            fromUser: fromUser, toUser: toUser, userId: userId
        });

    },

    async userInUsersBlockList(userId: string, id: string) {

        await userBlockList().deleteOne({
            userTargetId: id, userId: userId
        });

    },

    async groupInListOfUserGroup(id: string) {

        await listOfUserGroup().deleteMany({
            groupId: id
        });

    },

    async channelInListOfUserChannel(id: string) {

        await listOfUserChannel().deleteMany({
            channelId: id
        });

    },

    async userFromGroup(groupId: string, userId: string) {

        await listOfUserGroup().deleteOne({
            groupId: groupId, userId: userId
        });

    },

    async userFromChannel(channelId: string, userId: string) {

        await listOfUserChannel().deleteOne({
            channelId: channelId, userId: userId
        });

    },

    async savedMessage(phone: string) {

        await dropCollection(`${phone}SavedMessage`);

    },

    async userInAllUsersBlockList(id: string) {

        await userBlockList().deleteMany({
            userId: id
        });

    },

    async userInUsersTable(id: string) {

        await user().findByIdAndDelete(id);

    },

    async userInAllUsersGroup(array: ListOfGroupId, id: string) {

        // Drop user created group
        array.map(async e => await dropCollection(e.groupId));

        await listOfUserGroup().deleteMany({
            userId: id
        });

    },

    async userInAllUsersChannel(array: ListOfChannelId, id: string) {

        // Drop user created channelContent
        array.map(async e => await dropCollection(e.channelId));

        await listOfUserChannel().deleteMany({
            userId: id
        });

    },

    async userDataInJoinedChannels(arr: ListOfChannelId, userId: string) {
        // Delete the list of messages of any channelContent sent by the user
        for (const item of arr) {
            await deleteMany({
                senderId: userId
            }, `${item.channelId}ChannelContents`);
        }
    },

    async userDataInJoinedGroups(arr: ListOfGroupId, userId: string) {
        // Delete the list of messages of any group sent by the user
        for (const item of arr) {
            await deleteMany({
                senderId: userId
            }, `${item.groupId}GroupContents`);
        }
    },

    async userInAllUsersE2E(array: ListOfUserTableChat, id: string) {

        array.map(async e => await dropCollection(e.tblChatId));

        await listOfUserE2E().deleteMany({
            userId: id
        });

    },

    async userInDevices(id: string) {

        await device().deleteMany({
            userId: id
        });

    },

    async itemInSavedMessage(phone: string, listOfId: string[]) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(`${phone}SavedMessage`, item);

            if (id)
                await DeleteInCommon.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, `${phone}SavedMessage`);

    }

}