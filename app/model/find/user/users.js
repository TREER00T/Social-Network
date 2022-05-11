let openSql = require('app/database/OpenSql'),
    {
        OR,
        AND,
        EQUAL_TO,
        IS_NOT_NULL
    } = require('app/database/util/SqlKeyword'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    userPhone(phone, cb) {
        openSql.find({
            optionKeyword: [
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
            optionKeyword: [
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
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    password(phone, cb) {
        openSql.find({
            optionKeyword: [
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
            optionKeyword: [
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
            optionKeyword: [
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
            optionKeyword: [
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
            optionKeyword: [
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
            optionKeyword: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
                OR,
                EQUAL_TO,
                AND,
                EQUAL_TO,
            ],
            data: [
                'tblChatId', 'listofusere2es', 'to', `${data['to']}`,
                'from', `${data['from']}`, 'to', `${data['from']}`,
                'from', `${data['to']}`
            ],
            where: true
        }).result(result => {
            try {
                (result.length === 0) ? cb(false) : cb(result[0].tblChatId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }


}