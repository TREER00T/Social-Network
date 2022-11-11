let openSql = require('opensql'),
    UpdateInCommon = require('../../../../model/update/common/common'),
    {
        isUndefined
    } = require('../../../../util/Util'),
    {
        DataBaseException
    } = require('../../../../exception/DataBaseException');


module.exports = {

    async phoneAndAuthCode(phone, authCode, defaultColor) {

        return new Promise(res => {

            openSql.addOne({
                table: 'users',
                data: {
                    phone: `${phone}`,
                    authCode: authCode,
                    defaultColor: defaultColor
                }
            }).result(result => {
                res(result);
            });

        });


    },


    async chatIdInListOfUserE2Es(fromUser, toUser, userId, tableName) {
        await openSql.addOne({
            table: 'listOfUserE2Es',
            data: {
                toUser: toUser,
                fromUser: fromUser,
                userId: userId,
                tblChatId: tableName
            }
        });
    },


    async addUserToUsersBlockList(userId, userTargetId) {
        await openSql.addOne({
            table: 'userBlockList',
            data: {
                userId: userId,
                userTargetId: userTargetId
            }
        });
    },


    async userDeviceInformation(user) {
        await openSql.addOne({
            table: 'devices',
            data: {
                userId: user['id'],
                deviceIp: user['ip'],
                deviceName: user['name'],
                deviceLocation: user['location']
            }
        });
    },

    async groupIntoListOfUserGroups(groupId, userId) {
        await openSql.addOne({
            table: 'listOfUserGroups',
            data: {
                userId: userId,
                groupId: groupId
            }
        });
    },

    async channelIntoListOfUserChannels(channelId, userId) {
        await openSql.addOne({
            table: 'listOfUserChannels',
            data: {
                userId: userId,
                channelId: channelId
            }
        });
    },

    async messageIntoUserSavedMessage(phone, message) {

        if (!isUndefined(message?.forwardDataId)) {
            await openSql.addOne({
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

        await openSql.addOne({
            table: phone + 'SavedMessages',
            data: message
        });

    }

}