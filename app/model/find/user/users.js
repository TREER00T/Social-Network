let openSql = require('opensql'),
    {
        STAR,
        COUNT,
    } = openSql.keywordHelper,
    {
        isUndefined,
        isNotEmptyArr
    } = require('../../../util/Util'),
    {
        IN,
        ATTACH,
        EQUAL_TO,
        IS_NOT_NULL,
        setOperator
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('../../../exception/DataBaseException'),
    keyHelper = openSql.keywordHelper;


module.exports = {


    async isMessageBelongForThisUserInE2E(messageId, senderId, e2eId) {

        return new Promise(res => {

            openSql.find({
                get: ['id', 'senderId'],
                from: e2eId,
                where: {
                    id: IN(messageId),
                    senderId: senderId
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async userPhone(phone) {

        return new Promise(res => {

            openSql.find({
                get: 'phone',
                from: 'users',
                where: {
                    phone: `${phone}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isValidAuthCode(phone, authCode) {

        return new Promise(res => {

            openSql.find({
                get: ['phone', 'authCode'],
                from: 'users',
                where: {
                    phone: `${phone}`,
                    authCode: `${authCode}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getApiKeyAndUserId(phone) {

        return new Promise(res => {

            openSql.find({
                get: ['apiKey', 'id'],
                from: 'users',
                where: {
                    phone: `${phone}`
                }
            }).result(result => {
                try {
                    res(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async password(phone) {

        return new Promise(res => {

            openSql.find({
                get: 'password',
                from: 'users',
                where: {
                    phone: `${phone}`,
                    password: IS_NOT_NULL
                }
            }).result(result => {
                try {
                    res(result[1].length === 0 ? true : result[1][0].password.trim().length === 0);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isValidPassword(phone, password) {

        return new Promise(res => {

            openSql.find({
                get: 'password',
                from: 'users',
                where: {
                    phone: `${phone}`,
                    password: `${password}`
                }
            }).result(result => {
                try {
                    res(!isUndefined(result[1][0]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getApiKey(phone) {

        return new Promise(res => {

            openSql.find({
                get: 'apiKey',
                from: 'users',
                where: {
                    phone: `${phone}`
                }
            }).result(result => {
                try {
                    res(result[1][0].apiKey);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async isExistChatRoom(data) {

        return new Promise(res => {

            openSql.find({
                get: 'tblChatId',
                from: 'listOfUserE2ES',
                where: {
                    toUser: ATTACH([
                        setOperator(EQUAL_TO, `${data['toUser']}`),
                        setOperator(EQUAL_TO, `${data['fromUser']}`)
                    ]),
                    fromUser: ATTACH([
                        setOperator(EQUAL_TO, `${data['toUser']}`),
                        setOperator(EQUAL_TO, `${data['fromUser']}`)
                    ], keyHelper.OR)
                }
            }).result(result => {
                try {
                    !isNotEmptyArr(result) ? res(false) : res(result[0].tblChatId);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isExist(userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'users',
                where: {
                    id: `${userId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getTableNameForListOfE2EMessage(fromUser, toUser, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'tblChatId',
                from: 'listOfUserE2Es',
                where: {
                    userId: userId,
                    toUser: ATTACH([
                        setOperator(EQUAL_TO, `${toUser}`),
                        setOperator(EQUAL_TO, `${fromUser}`)
                    ]),
                    fromUser: ATTACH([
                        setOperator(EQUAL_TO, `${toUser}`),
                        setOperator(EQUAL_TO, `${fromUser}`)
                    ], keyHelper.OR)
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]?.tblChatId) ? res(result[1][0].tblChatId) : res(false);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getListOfMessage(data) {

        return new Promise(res => {

            if (!isUndefined(data.type)) {
                openSql.find({
                    get: STAR,
                    from: `${data.tableName}`,
                    where: {
                        type: type
                    },
                    option: {
                        order: [[data.order], data.sort],
                        limit: [data.startFrom, data.limit]
                    }
                }).result(result => {
                    try {
                        res(result[1][0]);
                    } catch (e) {
                        DataBaseException(e);
                    }
                });
                return;
            }

            if (!isUndefined(data.search)) {
                openSql.find({
                    get: STAR,
                    from: `${data.tableName}`,
                    where: {
                        text: `%${data.search}`
                    },
                    option: {
                        order: [[data.order], keyHelper.DESC],
                        limit: [data.startFrom, data.limit]
                    }
                }).result(result => {
                    try {
                        res(result[1][0]);
                    } catch (e) {
                        DataBaseException(e);
                    }
                });
                return;
            }


            openSql.find({
                get: STAR,
                from: `${data.tableName}`,
                option: {
                    order: [[data.order], data.sort],
                    limit: [data.startFrom, data.limit]
                }
            }).result(result => {
                try {
                    res(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getCountOfListMessage(tableName) {

        return new Promise(res => {

            openSql.find({
                get: COUNT,
                from: `${tableName}`
            }).result(result => {
                try {
                    res(result[0].size);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getUserPvDetails(userId) {

        return new Promise(res => {

            openSql.find({
                get: [
                    'img', 'bio', 'isActive',
                    'username', 'lastName',
                    'name', 'defaultColor'
                ],
                from: 'users',
                where: {
                    id: userId
                }
            }).result(result => {
                try {
                    res(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getPersonalUserDetails(userId) {

        return new Promise(res => {

            openSql.find({
                get: [
                    'img', 'bio', 'isActive',
                    'username', 'lastName',
                    'phone', 'email',
                    'name', 'defaultColor'
                ],
                from: 'users',
                where: {
                    id: userId
                }
            }).result(result => {
                try {
                    res(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async isBlock(from, targetId) {

        return new Promise(res => {

            openSql.find({
                get: STAR,
                from: 'userBlockList',
                where: {
                    userId: ATTACH([
                        setOperator(EQUAL_TO, `${from}`),
                        setOperator(EQUAL_TO, `${targetId}`)
                    ]),
                    userTargetId: ATTACH([
                        setOperator(EQUAL_TO, `${from}`),
                        setOperator(EQUAL_TO, `${targetId}`)
                    ], keyHelper.OR)
                }
            }).result(result => {
                try {
                    isNotEmptyArr(result[1]) ? res(result[1][0].id) : res(false);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async isExistUsername(id) {

        return new Promise(res => {

            openSql.find({
                get: 'username',
                from: 'users',
                where: {
                    username: `${id}`
                }
            }).result(result => {
                try {
                    res(isUndefined(result[1][0].username));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getListOfBlockUsers(id) {

        return new Promise(res => {

            openSql.find({
                get: 'userTargetId',
                from: 'userBlockList',
                where: {
                    userId: `${id}`
                }
            }).result(result => {
                try {
                    isUndefined(result[1][0]?.userTargetId) ? res(null) : res(result[1][0].userTargetId);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getUserDetailsInUsersTable(array) {

        return new Promise(res => {

            let arrayOfUserId = [];

            array.forEach(item => {

                arrayOfUserId.push(item['userTargetId']);

            });

            openSql.find({
                get: [
                    'img', 'name',
                    'username', 'id'
                ],
                from: 'users',
                where: {
                    id: IN(arrayOfUserId)
                }
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getUserDetailsInUsersTableForMember(array) {

        return new Promise(res => {

            let arrayOfUserId = [];

            array.forEach(item => {

                arrayOfUserId.push(item['userId']);

            });

            openSql.find({
                get: [
                    'img', 'name',
                    'username', 'id'
                ],
                from: 'users',
                where: {
                    id: IN(arrayOfUserId)
                }
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getListOfDevices(id) {

        return new Promise(res => {

            openSql.find({
                get: STAR,
                from: 'devices',
                where: {
                    id: `${id}`
                }
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getTableNameForListOfUserGroups(groupId, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'listOfUserGroups',
                where: {
                    userId: `${userId}`,
                    groupId: `${groupId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getTableNameForListOfUserChannels(channelId, userId) {

        return new Promise(res => {

            openSql.find({
                get: 'id',
                from: 'listOfUserChannels',
                where: {
                    userId: `${userId}`,
                    channelId: `${channelId}`
                }
            }).result(result => {
                try {
                    res(isNotEmptyArr(result[1]));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isSavedMessageCreated(phone) {

        return new Promise(res => {

            openSql.findTable(phone + 'SavedMessages').result(result => {
                try {
                    res(typeof result[0] === 'object');
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getListOfUserE2Es(userId) {

        return new Promise(res => {

            openSql.find({
                get: 'tblChatId',
                from: 'listOfUserE2Es',
                where: {
                    userId: `${userId}`
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]) ? res(result[1]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getListOfUserGroup(userId) {

        return new Promise(res => {

            openSql.find({
                get: 'groupId',
                from: 'listOfUserGroups',
                where: {
                    userId: `${userId}`
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]) ? res(result[1]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getListOfUserChannel(userId) {

        return new Promise(res => {

            openSql.find({
                get: 'channelId',
                from: 'listOfUserChannels',
                where: {
                    userId: `${userId}`
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]) ? res(result[1]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },


    async getDataWithId(tableName, id) {

        return new Promise(res => {

            openSql.find({
                get: STAR,
                from: `${tableName}`,
                where: {
                    id: `${id}`
                }
            }).result(result => {
                try {
                    !isUndefined(result[1][0]) ? res(result[1][0]) : res(null);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    }


}