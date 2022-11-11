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

    async isMessageBelongForThisUserInRoom(messageId, senderId, tableName) {

        return new Promise(res => {

            openSql.find({
                get: ['id', 'senderId'],
                from: tableName,
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

    async searchWithNameInTableUsersGroupsAndChannels(value) {

        return new Promise(res => {

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
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getListOfUserGroupsOrChannelsActivity(userId, type) {

        return new Promise(res => {

            openSql.find({
                get: [
                    `${type}s.id`, `${type}s.name`,
                    `${type}s.img`, `${type}s.defaultColor`
                ],
                from: [`listOfUser${type}s`, type],
                where: Generate.objectListOfUserActivityForWhereCondition(type, userId)
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getListOfUserE2esActivity(userId, type) {

        return new Promise(res => {

            openSql.find({
                get: [
                    'users.id', 'users.name',
                    'users.img', 'users.defaultColor'
                ],
                from: [`listOfUser${type}s`, 'users'],
                where: Generate.objectListOfUserActivityForWhereCondition(type, userId)
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async getListOfUsersActivity(userId) {

        return new Promise(res => {

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
                    isUndefined(result[1][0]) ? res(null) : res(result[1]);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    },

    async isForwardData(tableName, id) {

        return new Promise(res => {

            openSql.find({
                get: 'forwardDataId',
                from: tableName,
                where: {
                    id: ATTACH([setOperator(EQUAL_TO, id), IS_NOT_NULL])
                }
            }).result(result => {
                try {
                    isUndefined(result[1][0]) ? res(null) : res(result[1].forwardDataId);
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });

    }

}