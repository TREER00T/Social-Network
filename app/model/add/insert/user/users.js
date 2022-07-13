let openSql = require('opensql');


module.exports = {

    phoneAndAuthCode(phone, authCode, defaultColor, cb) {
        openSql.addOne({
            table: 'users',
            data: {
                phone: `${phone}`,
                authCode: authCode,
                defaultColor: defaultColor
            }
        }).result(result => {
            cb(result);
        });
    },


    chatIdInListOfUserE2Es(fromUser, toUser, userId, tableName) {
        openSql.addOne({
            table: 'listOfUserE2Es',
            data: {
                toUser: toUser,
                fromUser: fromUser,
                userId: userId,
                tblChatId: tableName
            }
        });
    },


    addUserToUsersBlockList(userId, userTargetId) {
        openSql.addOne({
            table: 'userBlockList',
            data: {
                userId: userId,
                userTargetId: userTargetId
            }
        });
    },


    userDeviceInformation(user) {
        openSql.addOne({
            table: 'devices',
            data: {
                userId: user['id'],
                deviceIp: user['ip'],
                deviceName: user['name'],
                deviceLocation: user['location']
            }
        });
    },

    groupIntoListOfUserGroups(groupId, userId) {
        openSql.addOne({
            table: 'listOfUserGroups',
            data: {
                userId: userId,
                groupId: groupId
            }
        });
    },

    channelIntoListOfUserChannels(channelId, userId) {
        openSql.addOne({
            table: 'listOfUserChannels',
            data: {
                userId: userId,
                channelId: channelId
            }
        });
    },

    messageIntoUserSavedMessage(phone, message) {
        openSql.addOne({
            text: message['text'],
            type: 'None',
            senderId: message['senderId'],
            isReply: message['isReply'],
            location: message['location'],
            isForward: message['isForward'],
            forwardDataId: message['forwardDataId'],
            targetReplyId: message['targetReplyId']
        });
    }

}