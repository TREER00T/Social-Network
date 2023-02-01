import {TE2EMessage} from "../../../module/base/dto/TE2EMessage";
import {RoomMessage} from "../../../module/base/dto/RoomMessage";
import {JsonObject} from "../../../util/Types"

let {forwardContent} = require('../../create/common'),
    {insertOne} = require('../../../database/mongoDbDriverConnection'),
    UpdateInCommon = require('../../update/common');

export default {

    async message(tableName: string, data: JsonObject | TE2EMessage | RoomMessage, forwardData) {

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