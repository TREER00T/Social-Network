let openSql = require('app/database/OpenSql');


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
            (result) ? cb(true) : cb(false);
        });
    },

    chatIdInListOfUserE2Es(fromUser, toUser, tableName) {
        openSql.addOne({
            table: 'listOfUserE2Es',
            data: {
                toUser: toUser,
                fromUser: fromUser,
                tblChatId: tableName
            }
        });
    }

}