let openSql = require('opensql');


module.exports = {

    message(tableName, id) {
        openSql.remove({
            table: tableName,
            where: {
                id: id
            }
        })
    }

}