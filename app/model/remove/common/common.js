let openSql = require('opensql'),
    {
        isUndefined
    } = require('app/util/Util'),
    {
        IN
    } = openSql.queryHelper,
    FindInCommon = require('app/model/find/common/common');


module.exports = {

    message(tableName, listOfId) {

        listOfId.forEach(item => {
            FindInCommon.isForwardData(tableName, item, id => {
                if (!isUndefined(id))
                    module.exports.forwardMessage(id);
            });
        });

        openSql.remove({
            table: tableName,
            where: {
                id: IN(listOfId)
            }
        });
    },

    forwardMessage(id) {
        openSql.remove({
            table: 'forwardContents',
            where: {
                id: id
            }
        });
    }

}