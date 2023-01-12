let {
        forwardContent
    } = require('../../create/common'),
    {deleteMany} = require('../../../database/mongoDbDriverConnection');
import Util from '../../../util/Util';
import FindInCommon from '../../../model/find/common';

export default {

    async message(tableName, listOfId) {

        for (const item of listOfId) {
            let id = await FindInCommon.isForwardData(tableName, item);

            if (!Util.isUndefined(id))
                await module.exports.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, tableName);

    },

    async forwardMessage(id) {

        await forwardContent().findByIdAndDelete(id);

    }

}