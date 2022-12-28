let {
        isUndefined
    } = require('../../../util/Util'),
    FindInCommon = require('../../find/common'),
    {
        forwardContent
    } = require('../../create/common'),
    {deleteMany} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async message(tableName, listOfId) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(tableName, item);

            if (!isUndefined(id))
                await module.exports.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, tableName);

    },

    async forwardMessage(id) {

        await forwardContent().findByIdAndDelete(id);

    }

}