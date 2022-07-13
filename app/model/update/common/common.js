let openSql = require('opensql');


module.exports = {

    message(tableName, data, id) {
        openSql.update({
            table: tableName,
            edit: data,
            where: {
                id: id
            }
        });
    }

}