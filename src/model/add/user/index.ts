let {
        user,
        device,
        listOfUserE2E,
        userBlockList,
        listOfUserGroup,
        listOfUserChannel
    } = require('../../create/user'),
    UpdateInCommon = require('../../../model/update/common'),
    {
        forwardContent
    } = require('../../create/common'),
    {
        insertOne
    } = require('../../../database/mongoDbDriverConnection');
import Util from '../../../util/Util';


export default {

    async phoneAndAuthCode(phone, authCode, defaultColor) {

        return await user()({
            phone: phone,
            authCode: authCode,
            defaultColor: defaultColor
        }).save();

    },


    async chatIdInListOfUserE2E(fromUser, toUser, userId, tableName) {

        await listOfUserE2E()({
            toUser: toUser,
            fromUser: fromUser,
            userId: userId,
            tblChatId: tableName
        }).save();

    },


    async addUserToUsersBlockList(userId, userTargetId) {

        await userBlockList()({
            userId: userId,
            userTargetId: userTargetId
        }).save();

    },


    async userDeviceInformation(user) {

        await device()({
            userId: user.id,
            deviceIp: user.ip,
            deviceName: user.name,
            deviceLocation: user.location
        }).save();

    },

    async groupIntoListOfUserGroup(groupId, userId) {

        await listOfUserGroup()({
            userId: userId,
            groupId: groupId
        }).save();

    },

    async channelIntoListOfUserChannels(channelId, userId) {

        await listOfUserChannel()({
            userId: userId,
            channelId: channelId
        }).save();

    },

    async messageIntoUserSavedMessage(phone, message) {

        if (!Util.isUndefined(message?.forwardDataId)) {
            let data = await forwardContent()({
                conversationId: `${phone}SavedMessages`,
                conversationType: 'Personal'
            }).save();

            message.forwardDataId = `${data._id}`;
            message.isForward = 1;

            let insertedData = await insertOne(message, `${phone}SavedMessages`);

            await UpdateInCommon.messageIdFromTableForwardContents(message.forwardDataId, insertedData.insertedId);

            return;
        }

        await insertOne(message, `${phone}SavedMessages`);

    }

}