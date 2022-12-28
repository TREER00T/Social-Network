import {HandleMessage} from "./HandleMessage";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {Message} from "./dto/Message";


let CommonInsert = require("../../model/add/common"),
    Find = require("../../model/find/user");

export abstract class E2EMessage extends HandleMessage {

    async getNameOfE2EChat(targetUserId) {
        let e2eChatName = await Find.getTableNameForListOfE2EMessage(this.userId, targetUserId, this.userId);

        if (!e2eChatName)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        return e2eChatName;
    }

    async uploadFile(tableName: string, message: Message, conversationType: string) {
        return await CommonInsert.message(tableName, message, {
            conversationType: conversationType
        });
    }

    async isExistChatRoom(obj) {
        return await Find.isExistChatRoom(obj);
    }

}