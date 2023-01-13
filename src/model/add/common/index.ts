let {forwardContent} = require('../../create/common'),
    {insertOne} = require('../../../database/mongoDbDriverConnection'),
    UpdateInCommon = require('../../update/common');
import {JsonObject} from "../../../util/Types";

export default {

    async message(tableName: string, data: JsonObject, forwardData) {

        if (data?.forwardDataId) {
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