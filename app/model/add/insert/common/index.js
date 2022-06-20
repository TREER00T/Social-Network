let openSql = require('app/database/OpenSql');


module.exports = {

    message(tableName, data) {
        openSql.addOne({
            table: tableName,
            data: data
        });
    }

}