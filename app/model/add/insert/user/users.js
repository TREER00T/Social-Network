let openSql = require('app/database/OpenSql');


module.exports = {

    phoneAndAuthCode(phone, authCode, cb) {
        openSql.addOne({
            table: 'users',
            data: {
                phone: `${phone}`,
                authCode: authCode
            }
        }).result(result => {
            (result) ? cb(true) : cb(false);
        })
    }

}