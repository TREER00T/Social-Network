let openSql = require('app/database/OpenSql');


module.exports = {

    authCode(phone,authCode,cb) {
        openSql.update({
            table: 'users',
            editField: {
                authCode: authCode
            },
            where: {
                phone: `${phone}`
            }
        }).result((result) => {
           (result[1].changedRows !== 0) ? cb(true) : cb(false);
        })
    }

}