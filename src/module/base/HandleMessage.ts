import {Message} from "./dto/Message";
import Util from "../../util/Util";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {UserInput} from "./UserInput";

let Find = require("../../model/find/user");

export abstract class HandleMessage extends UserInput{

    async getListOfMessageCount(tableName: string, limit: number) {
        return Math.ceil(await Find.getCountOfListMessage(tableName) / limit);
    }

    async getListOfMessage(tableName: string, obj: any) {
        return await Find.getListOfMessage({
            ...obj,
            tableName: tableName
        });
    }

    async handleMessage(msg: Message) {
        let message = Util.validateMessage(msg);

        if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        return message;
    }

}