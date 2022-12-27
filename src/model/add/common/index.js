let {forwardContent} = require('../../create/common'),
    {
        isUndefined
    } = require('../../../util/Util'),
    {insertOne} = require('../../../database/mongoDbDriverConnection'),
    UpdateInCommon = require('../../update/common');


module.exports = {

    async message(tableName, data, forwardData) {

        if (!isUndefined(data?.forwardDataId)) {
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