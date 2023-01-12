import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {Message} from "./dto/Message";
import {User} from "./User";
import CommonInsert from "../../model/add/common";
import Find from "../../model/find/user";

export abstract class E2EMessage extends User {

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