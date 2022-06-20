let openSql = require('app/database/OpenSql');


module.exports = {

    message(tableName, data, cb) {
        openSql.addOne({
            table: tableName,
            data: data
        }).result(result => {
            console.log(result);
           (result) ? cb(true) : cb(false);
        });
    }

}