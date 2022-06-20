let openSql = require('app/database/OpenSql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    message(tableName, data, cb) {
        openSql.addOne({
            table: tableName,
            data: data
        }).result(result => {
            try {
                cb(result[1].insertId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}