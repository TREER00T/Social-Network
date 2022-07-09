let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    isExistTable(tableName, cb) {

        openSql.findTable(tableName).result(result => {
            try {
                cb(result.length === 0);
            } catch (e) {
                DataBaseException(e);
            }
        });

    }

}