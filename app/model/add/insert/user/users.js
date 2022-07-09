let openSql = require('opensql');


module.exports = {

    phoneAndAuthCode(phone, authCode, defaultColor, cb) {
        openSql.addOne({
            table: 'users',
            data: {
                phone: `${phone}`,
                authCode: authCode,
                defaultColor: defaultColor
            }
        }).result(result => {
            cb(result);
        });
    },


    chatIdInListOfUserE2Es(fromUser, toUser, userId, tableName) {
        openSql.addOne({
            table: 'listOfUserE2Es',
            data: {
                toUser: toUser,
                fromUser: fromUser,
                userId: userId,
                tblChatId: tableName
            }
        });
    },


    addUserToUsersBlockList(userId, userTargetId) {
        openSql.addOne({
            table: 'userBlockList',
            data: {
                userId: userId,
                userTargetId: userTargetId
            }
        });
    }

}