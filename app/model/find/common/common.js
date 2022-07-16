let openSql = require('opensql'),
    {
        UNION_ALL,
        LIKE,
        OR,
        AND
    } = openSql.keywordHelper,
    {
        SOURCE,
        IS_NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    {
        EQUAL_TO
    } = openSql.keywordHelper;


module.exports = {


    searchWithNameInTableUsersGroupsAndChannels(value, cb) {

        openSql.find({
            optKey: [
                LIKE, OR, LIKE, UNION_ALL,
                LIKE, OR, LIKE, AND, IS_NOT_NULL, UNION_ALL,
                LIKE, OR, LIKE, AND, IS_NOT_NULL,
            ],
            data: [
                ['id', 'name', 'img', 'defaultColor'], 'users',
                'name', `%${value}`, 'username', `%${value}`,
                ['id', 'name', 'img', 'defaultColor'], 'groups',
                'name', `%${value}`, 'publicLink', `%${value}`, 'publicLink',
                ['id', 'name', 'img', 'defaultColor'], 'channels',
                'name', `%${value}`, 'publicLink', `%${value}`, 'publicLink',
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

    getListOfUserGroupsOrChannelsActivity(userId, type, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: [
                [`${type}s.id`, `${type}s.name`, `${type}s.img`, `${type}s.defaultColor`], [`listOfUser${type}s`, type], `listOfUser${type}s.userId`, `${userId}`
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

    getListOfUserE2esActivity(userId, type, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: [
                ['users.id', 'users.name', 'users.img', 'users.defaultColor'], [`listOfUser${type}s`, 'users'], `listOfUser${type}s.userId`, `${userId}`
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

    getListOfUsersActivity(userId, cb) {
        openSql.find({
            optKey: [
                SOURCE('user', 'type'),
                EQUAL_TO,
                UNION_ALL,
                SOURCE('group', 'type'),
                EQUAL_TO,
                UNION_ALL,
                SOURCE('channel', 'type'),
                EQUAL_TO
            ],
            data: [
                ['users.id', 'users.name', 'users.img', 'users.defaultColor'], ['users', 'listOfUserE2Es'], 'listOfUserE2Es.userId', `${userId}`,
                ['groups.id', 'groups.name', 'groups.img', 'groups.defaultColor'], ['groups', 'listOfUserGroups'], 'listOfUserGroups.userId', `${userId}`,
                ['channels.id', 'channels.name', 'channels.img', 'channels.defaultColor'], ['channels', 'listOfUserChannels'], 'listOfUserChannels.userId', `${userId}`
            ],
            where: true
        }).result(result => {
            try {
                (result[1][0] === undefined) ? cb(null) : cb(result[1]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}