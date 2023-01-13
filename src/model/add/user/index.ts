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
import {TUserDeviceInfo} from "../../../util/Types";


export default {

    async phoneAndAuthCode(phone: string, authCode: number, defaultColor: string) {

        return await user()({
            phone: phone,
            authCode: authCode,
            defaultColor: defaultColor
        }).save();

    },


    async chatIdInListOfUserE2E(fromUser: string, toUser: string, userId: string, tableName: string) {

        await listOfUserE2E()({
            toUser: toUser,
            fromUser: fromUser,
            userId: userId,
            tblChatId: tableName
        }).save();

    },


    async addUserToUsersBlockList(userId: string, userTargetId: string) {

        await userBlockList()({
            userId: userId,
            userTargetId: userTargetId
        }).save();

    },


    async userDeviceInformation(user: TUserDeviceInfo) {

        await device()({
            userId: user.id,
            deviceIp: user.ip,
            deviceName: user.name,
            deviceLocation: user.location
        }).save();

    },

    async groupIntoListOfUserGroup(groupId: string, userId: string) {

        await listOfUserGroup()({
            userId: userId,
            groupId: groupId
        }).save();

    },

    async channelIntoListOfUserChannels(channelId: string, userId: string) {

        await listOfUserChannel()({
            userId: userId,
            channelId: channelId
        }).save();

    },

    async messageIntoUserSavedMessage(phone: string, message) {

        if (message?.forwardDataId) {
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