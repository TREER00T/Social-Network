let openSql = require('opensql'),
    Generate = require('../../../util/Generate'),
    {
        isUndefined,
        isNotEmptyArr
    } = require('../../../util/Util'),
    {
        IN,
        LIKE,
        SOURCE,
        ATTACH,
        UNION_ALL,
        setOperator,
        IS_NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('../../../exception/DataBaseException'),
    {
        EQUAL_TO
    } = openSql.keywordHelper,
    keyHelper = openSql.keywordHelper;


module.exports = {

    isMessageBelongForThisUserInRoom(messageId, senderId, tableName, cb) {
        openSql.find({
            get: ['id', 'senderId'],
            from: tableName,
            where: {
                id: IN(messageId),
                senderId: senderId
            }
        }).result(result => {
            try {
                cb(isNotEmptyArr(result[1]));
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    searchWithNameInTableUsersGroupsAndChannels(value, cb) {
        openSql.find({
            get: [
                SOURCE('user', 'type'),
                'id', 'name',
                'img', 'defaultColor'
            ],
            from: 'users',
            where: {
                name: LIKE(`%${value}`),
                username: LIKE(`%${value}`, keyHelper.OR)
            },
            union: [
                UNION_ALL({
                    get: [
                        SOURCE('group', 'type'),
                        'id', 'name',
                        'img', 'defaultColor'
                    ],
                    from: 'groups',
                    where: {
                        name: LIKE(`%${value}`),
                        publicLink: ATTACH([LIKE(`%${value}`), IS_NOT_NULL], keyHelper.OR)
                    }
                }),
                UNION_ALL({
                    get: [
                        SOURCE('channel', 'type'),
                        'id', 'name',
                        'img', 'defaultColor'
                    ],
                    from: 'channels',
                    where: {
                        name: LIKE(`%${value}`),
                        publicLink: ATTACH([LIKE(`%${value}`), IS_NOT_NULL], keyHelper.OR)
                    }
                })
            ]
        }).result(result => {
            try {
                isUndefined(result[1][0]) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });

    },

    getListOfUserGroupsOrChannelsActivity(userId, type, cb) {
        openSql.find({
            get: [
                `${type}s.id`, `${type}s.name`,
                `${type}s.img`, `${type}s.defaultColor`
            ],
            from: [`listOfUser${type}s`, type],
            where: Generate.objectListOfUserActivityForWhereCondition(type, userId)
        }).result(result => {
            try {
                isUndefined(result[1][0]) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getListOfUserE2esActivity(userId, type, cb) {
        openSql.find({
            get: [
                'users.id', 'users.name',
                'users.img', 'users.defaultColor'
            ],
            from: [`listOfUser${type}s`, 'users'],
            where: Generate.objectListOfUserActivityForWhereCondition(type, userId)
        }).result(result => {
            try {
                isUndefined(result[1][0]) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    getListOfUsersActivity(userId, cb) {
        openSql.find({
            get: [
                SOURCE('user', 'type'),
                'users.id', 'users.name',
                'users.img', 'users.defaultColor'
            ],
            from: ['users', 'listOfUserE2Es'],
            where: {
                'listOfUserE2Es.userId': `${userId}`
            },
            union: [
                UNION_ALL({
                    get: [
                        SOURCE('group', 'type'),
                        'groups.id', 'groups.name',
                        'groups.img', 'groups.defaultColor'
                    ],
                    from: ['groups', 'listOfUserGroups'],
                    where: {
                        'listOfUserGroups.userId': `${userId}`
                    },
                }),
                UNION_ALL({
                    get: [
                        SOURCE('channel', 'type'),
                        'channels.id', 'channels.name',
                        'channels.img', 'channels.defaultColor'
                    ],
                    from: ['channels', 'listOfUserChannels'],
                    where: {
                        'listOfUserChannels.userId': `${userId}`
                    },
                })
            ]
        }).result(result => {
            try {
                isUndefined(result[1][0]) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isForwardData(tableName, id, cb) {
        openSql.find({
            get: 'forwardDataId',
            from: tableName,
            where: {
                id: ATTACH([setOperator(EQUAL_TO, id), IS_NOT_NULL])
            }
        }).result(result => {
            try {
                isUndefined(result[1][0]) ? cb(null) : cb(result[1].forwardDataId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}