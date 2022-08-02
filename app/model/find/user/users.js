let openSql = require('opensql'),
    {
        STAR,
        COUNT,
    } = openSql.keywordHelper,
    {
        IN,
        ATTACH,
        EQUAL_TO,
        IS_NOT_NULL,
        setOperator
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    keyHelper = openSql.keywordHelper;


module.exports = {


    isMessageBelongForThisUserInE2E(messageId, senderId, e2eId, cb) {
        openSql.find({
            get: ['id', 'senderId'],
            from: e2eId,
            where: {
                id: IN(messageId),
                senderId: senderId
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    userPhone(phone, cb) {
        openSql.find({
            get: 'phone',
            from: 'users',
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isValidAuthCode(phone, authCode, cb) {
        openSql.find({
            get: ['phone', 'authCode'],
            from: 'users',
            where: {
                phone: `${phone}`,
                authCode: `${authCode}`
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    password(phone, cb) {
        openSql.find({
            get: 'password',
            from: 'users',
            where: {
                phone: `${phone}`,
                password: IS_NOT_NULL
            }
        }).result(result => {
            try {
                cb(result[1].length === 0);
                let password = result[1][0].password.trim();
                cb(password.length === 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isValidPassword(phone, password, cb) {
        openSql.find({
            get: 'password',
            from: 'users',
            where: {
                phone: `${phone}`,
                password: `${password}`
            }
        }).result(result => {
            try {
                cb(typeof result[1][0] !== 'undefined');
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getApiKey(phone, cb) {
        openSql.find({
            get: 'apiKey',
            from: 'users',
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1][0].apiKey);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getUserId(phone, cb) {
        openSql.find({
            get: 'id',
            from: 'users',
            where: {
                phone: `${phone}`
            }
        }).result(result => {
            try {
                cb(result[1][0].id);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    isExistChatRoom(data, cb) {
        openSql.find({
            get: 'tblChatId',
            from: 'listofusere2es',
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
                (result.length === 0) ? cb(false) : cb(result[0].tblChatId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isExistUser(userId, cb) {
        openSql.find({
            get: 'id',
            from: 'users',
            where: {
                id: `${userId}`
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getTableNameForListOfE2EMessage(fromUser, toUser, userId, cb) {
        openSql.find({
            get: 'tblChatId',
            from: 'listOfUserE2Es',
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
                (result[1][0].tblChatId !== undefined) ? cb(result[1][0].tblChatId) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getListOfMessage(tableName, startFrom, limit, order, sort, type, search, cb) {
        if (type !== undefined) {
            openSql.find({
                get: STAR,
                from: `${tableName}`,
                where: {
                    type: type
                },
                option: {
                    order: [[order], sort],
                    limit: [startFrom, limit]
                }
            }).result(result => {
                try {
                    cb(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });
            return;
        }

        if (search !== undefined) {
            openSql.find({
                get: STAR,
                from: `${tableName}`,
                where: {
                    text: `%${search}`
                },
                option: {
                    order: [[order], keyHelper.DESC],
                    limit: [startFrom, limit]
                }
            }).result(result => {
                try {
                    cb(result[1][0]);
                } catch (e) {
                    DataBaseException(e);
                }
            });
            return;
        }


        openSql.find({
            get: STAR,
            from: `${tableName}`,
            option: {
                order: [[order], sort],
                limit: [startFrom, limit]
            }
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getCountOfListMessage(tableName, cb) {
        openSql.find({
            get: COUNT,
            from: `${tableName}`
        }).result(result => {
            try {
                cb(result[0].size);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getUserPvDetails(userId, cb) {
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
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getPersonalUserDetails(userId, cb) {
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
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    isUserInListOfBlockUser(from, targetId, cb) {
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
                (result[1].length !== 0) ? result[1][0].id : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    isUsernameUsed(id, cb) {
        openSql.find({
            get: 'username',
            from: 'users',
            where: {
                username: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1][0].username === undefined);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getListOfBlockUsers(id, cb) {
        openSql.find({
            get: 'userTargetId',
            from: 'userBlockList',
            where: {
                userId: `${id}`
            }
        }).result(result => {
            try {
                (result[1][0].userTargetId === undefined) ? cb(null) : cb(result[1][0].userTargetId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getUserDetailsInUsersTable(array, cb) {
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
                (result[1][0] === undefined) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });

    },


    getUserDetailsInUsersTableForMember(array, cb) {
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
                (result[1][0] === undefined) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });

    },


    getListOfDevices(id, cb) {
        openSql.find({
            get: STAR,
            from: 'devices',
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                (result[1][0] === undefined) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getTableNameForListOfUserGroups(groupId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'listOfUserGroups',
            where: {
                userId: `${userId}`,
                groupId: `${groupId}`
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getTableNameForListOfUserChannels(channelId, userId, cb) {
        openSql.find({
            get: 'id',
            from: 'listOfUserChannels',
            where: {
                userId: `${userId}`,
                channelId: `${channelId}`
            }
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isSavedMessageCreated(phone, cb) {
        openSql.findTable(phone + 'SavedMessages')
            .result(result => {
                try {
                    cb(typeof result[0] === 'object');
                } catch (e) {
                    DataBaseException(e);
                }
            });
    },


    getListOfUserE2Es(userId, cb) {
        openSql.find({
            get: 'tblChatId',
            from: 'listOfUserE2Es',
            where: {
                userId: `${userId}`
            }
        }).result(result => {
            try {
                (result[1][0] !== undefined) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getListOfUserGroup(userId, cb) {
        openSql.find({
            get: 'groupId',
            from: 'listOfUserGroups',
            where: {
                userId: `${userId}`
            }
        }).result(result => {
            try {
                (result[1][0] !== undefined) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getListOfUserChannel(userId, cb) {
        openSql.find({
            get: 'channelId',
            from: 'listOfUserChannels',
            where: {
                userId: `${userId}`
            }
        }).result(result => {
            try {
                (result[1][0] !== undefined) ? cb(result[1]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getDataForE2EContentWithId(tableName, id, cb) {
        openSql.find({
            get: STAR,
            from: `${tableName}`,
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                (result[1][0] !== undefined) ? cb(result[1][0]) : cb(null);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }


}