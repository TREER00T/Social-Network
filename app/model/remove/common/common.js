let openSql = require('opensql'),
    {
        IN
    } = openSql.queryHelper;


module.exports = {

    message(tableName, listOfId) {
        openSql.remove({
            table: tableName,
            where: {
                id: IN(listOfId)
            }
        })
    }

}