let openSql = require('opensql'),
    UpdateInCommon = require('app/model/update/common/common'),
    {
        isUndefined
    } = require('app/util/Util'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


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
        if (!isUndefined(message?.forwardDataId)) {
            openSql.addOne({
                table: 'forwardContents',
                data: {
                    conversationId: phone + 'SavedMessages',
                    conversationType: 'Personal'
                }
            }).result(result => {
                try {
                    message['forwardDataId'] = result[1].insertId;
                    message['isForward'] = 1;
                    openSql.addOne({
                        table: phone + 'SavedMessages',
                        data: message
                    }).result(result => {
                        try {
                            let messageId = result[1].insertId;
                            UpdateInCommon.messageIdFromTableForwardContents(message['forwardDataId'], messageId);
                        } catch (e) {
                            DataBaseException(e);
                        }
                    });

                } catch (e) {
                    DataBaseException(e);
                }
            });
            return;
        }

        openSql.addOne({
            table: phone + 'SavedMessages',
            data: message
        });
    }

}