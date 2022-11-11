let openSql = require('opensql'),
    {
        isUndefined
    } = require('../../../util/Util'),
    {
        IN
    } = openSql.queryHelper,
    FindInCommon = require('../../../model/find/common/common');


module.exports = {

    async message(tableName, listOfId) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(tableName, item);
            if (!isUndefined(id))
                await module.exports.forwardMessage(id);
        }

        await openSql.remove({
            table: tableName,
            where: {
                id: IN(listOfId)
            }
        });
    },

    async forwardMessage(id) {
        await openSql.remove({
            table: 'forwardContents',
            where: {
                id: id
            }
        });
    }

}