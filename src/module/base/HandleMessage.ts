import {RoomMessage} from "./dto/RoomMessage";
import Util from "../../util/Util";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {UserInput} from "./UserInput";
import {JsonObject} from "../../util/Types";
import Find from "../../model/find/user";

export abstract class HandleMessage extends UserInput {

    async getListOfMessage(tableName: string, obj: any) {
        return await Find.getListOfMessage({
            ...obj,
            tableName: tableName
        });
    }

    async handleMessage(msg: RoomMessage | JsonObject) {
        let message = Util.validateMessage(msg);

        if (message === Util.IN_VALID_MESSAGE_TYPE || message === Util.IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_UNSUPPORTED_MEDIA_TYPE);

        return message;
    }

}