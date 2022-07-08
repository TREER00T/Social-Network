let openSql = require('opensql'),
    {
        OR,
        AND,
        STAR,
        EQUAL_TO
    } = openSql.keywordHelper,
    {
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
                (result[1].length !== 0) ? cb(true) : cb(false);
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
            console.log(result)
            try {
                (result[1].length !== 0) ? cb(true) : cb(false);
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
                (result[1].length === 0) ? cb(true) : cb(false);
                let password = result[1][0].password.trim();
                (password.length === 0) ? cb(true) : cb(false);
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
                (typeof result[1][0] !== 'undefined') ? cb(true) : cb(false);
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
                (result[1].length !== 0) ? cb(true) : cb(false);
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
                EQUAL_TO,
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
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },


    getTableNameForListOfE2EMessage(fromUser, toUser, cb) {
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
                'tblChatId', 'listOfUserE2Es', 'toUser', `${toUser}`,
                'fromUser', `${fromUser}`, 'toUser', `${fromUser}`, 'fromUser', `${toUser}`
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


    getListOfMessage(tableName, cb) {
        openSql.find({
            optKey: [
                STAR
            ],
            data: [
                `${tableName}`
            ]
        }).result(result => {
            try {
                cb(result[1][0]);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }


}