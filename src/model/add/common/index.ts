import {TE2EMessage} from "../../../module/base/dto/TE2EMessage";
import {RoomMessage} from "../../../module/base/dto/RoomMessage";
import {JsonObject} from "../../../util/Types"

let {insertOne} = require('../../../database/mongoDbDriverConnection');

export default {

    async message(tableName: string, data: JsonObject | TE2EMessage | RoomMessage) {

        let insertedData = await insertOne(data, tableName);

        return insertedData?.insertedId;

    }

}