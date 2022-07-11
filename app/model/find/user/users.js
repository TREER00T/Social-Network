let openSql = require('opensql'),
    {
        OR,
        IN,
        AND,
        STAR,
        DESC,
        LIKE,
        COUNT,
        LIMIT,
        ORDER_BY
    } = openSql.keywordHelper,
    {
        EQUAL_TO,
        IS_NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    userPhone(phone, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['phone', 'users', 'phone', `${phone}`],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                ['phone', 'authCode'], 'users', 'phone',
                `${phone}`, 'authCode', `${authCode}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                IS_NOT_NULL
            ],
            data: [
                'password', 'users', 'phone', `${phone}`,
                'password'
            ],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'password', 'users', 'phone',
                `${phone}`, 'password', `${password}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: [
                'apiKey', 'users', 'phone', `${phone}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: [
                'id', 'users', 'phone', `${phone}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1][0].id);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    isGroupIdInUserList(groupId, userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'groupId', 'listofusergroups', 'groupId', `${groupId}`,
                'userId', `${userId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    isExistChatRoom(data, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
                OR,
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'tblChatId', 'listofusere2es', 'toUser', `${data['toUser']}`,
                'fromUser', `${data['fromUser']}`, 'toUser', `${data['fromUser']}`,
                'fromUser', `${data['toUser']}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'users', 'id', `${userId}`],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
                AND,
                EQUAL_TO,
                OR,
                EQUAL_TO,
                AND,
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'tblChatId', 'listOfUserE2Es', 'toUser', `${toUser}`,
                'fromUser', `${fromUser}`, 'userId', `${userId}`,
                'toUser', `${fromUser}`, 'fromUser', `${toUser}`, 'userId', `${userId}`
            ],
            where: true
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
                optKey: [
                    STAR,
                    EQUAL_TO,
                    ORDER_BY,
                    sort,
                    LIMIT
                ],
                data: [
                    `${tableName}`, 'type', type, order, [startFrom, limit]
                ],
                where: true
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
                optKey: [
                    STAR,
                    LIKE,
                    ORDER_BY,
                    DESC,
                    LIMIT
                ],
                data: [
                    `${tableName}`, 'test', `%${search}`, order, [startFrom, limit]
                ],
                where: true
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
            optKey: [
                STAR,
                ORDER_BY,
                sort,
                LIMIT
            ],
            data: [
                `${tableName}`, order, [startFrom, limit]
            ]
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
            optKey: [
                COUNT
            ],
            data: [
                `${tableName}`
            ]
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
            optKey: [
                EQUAL_TO
            ],
            data: [
                ['img', 'bio', 'isActive',
                    'username', 'lastName',
                    'firstName', 'defaultColor'],
                'users', 'id', userId
            ],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: [
                ['img', 'bio', 'isActive',
                    'username', 'lastName',
                    'phone', 'email',
                    'firstName', 'defaultColor'],
                'users', 'id', userId
            ],
            where: true
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
            optKey: [
                STAR,
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'userBlockList', 'userId', `${from}`, 'userTargetId', `${targetId}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: ['username', 'users', 'username', `${id}`],
            where: true
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
            optKey: [
                EQUAL_TO
            ],
            data: [
                'userTargetId', 'userBlockList', 'userId', `${id}`
            ],
            where: true
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
            optKey: [
                IN
            ],
            data: [
                ['img', 'firstName', 'username', 'id'], 'users', 'id', arrayOfUserId
            ],
            where: true
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
            optKey: [
                IN
            ],
            data: [
                ['img', 'firstName', 'username', 'id'], 'users', 'id', arrayOfUserId
            ],
            where: true
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
            optKey: [
                STAR,
                EQUAL_TO
            ],
            data: [
                'devices', 'userId', `${id}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'listOfUserGroups', 'userId',
                `${userId}`, 'groupId', `${groupId}`
            ],
            where: true
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
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'listOfUserChannels', 'userId',
                `${userId}`, 'channelId', `${channelId}`
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }


}