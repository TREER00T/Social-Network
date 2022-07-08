let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    isExistTable(tableName, cb) {

        openSql.findTable(tableName).result(result => {
            try {
                (result.length === 0) ? cb(false) : cb(true);
            } catch (e) {
                DataBaseException(e);
            }
        });

    }

}