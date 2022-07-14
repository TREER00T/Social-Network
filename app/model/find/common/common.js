let openSql = require('opensql'),
    {
        UNION_ALL,
        LIKE,
        OR,
        AND
    } = openSql.keywordHelper,
    {
        IS_NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException');
const {EQUAL_TO} = require("opensql/src/util/QueryHelper");


module.exports = {

    isExistTable(tableName, cb) {

        openSql.findTable(tableName).result(result => {
            try {
                cb(result.length === 0);
            } catch (e) {
                DataBaseException(e);
            }
        });

    },

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
            (result[1][0] === undefined) ? cb(null) : cb(result[1]);
        });

    },


    getListOfUsersActivity(userId, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO,
                UNION_ALL,
                EQUAL_TO,
                UNION_ALL,
                EQUAL_TO
            ],
            data: [
                ['users.id', 'users.name', 'users.img', 'users.defaultColor'], ['users', 'listOfUserE2Es'], 'listOfUserE2Es.userId', `${userId}`,
                ['groups.id', 'groups.name', 'groups.img', 'groups.defaultColor'], ['groups', 'listOfUserGroups'], 'listOfUserGroups.userId', `${userId}`,
                ['channels.id', 'channels.name', 'channels.img', 'channels.defaultColor'], ['channels', 'listOfUserChannels'], 'listOfUserChannels.userId', `${userId}`
            ],
            where: true
        }).result(result => {
            (result[1][0] === undefined) ? cb(null) : cb(result[1]);
        });
    }

}