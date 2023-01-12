let {forwardContent} = require('../../create/common'),
    {insertOne} = require('../../../database/mongoDbDriverConnection'),
    UpdateInCommon = require('../../update/common');
import Util from '../../../util/Util';

export default {

    async message(tableName, data, forwardData) {

        if (!Util.isUndefined(data?.forwardDataId)) {
            let data = await forwardContent()({
                conversationId: tableName,
                conversationType: forwardData?.conversationType
            }).save();


            data.forwardDataId = `${data._id}`;
            data.isForward = 1;

            let insertedData = await insertOne(data, tableName);

            let messageId = insertedData.insertedId;
            await UpdateInCommon.messageIdFromTableForwardContents(data.forwardDataId, messageId);

            return messageId;
        }

        let insertedData = await insertOne(data, tableName);

        return insertedData?.insertedId;

    }

}