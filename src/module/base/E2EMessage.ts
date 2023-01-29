import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {RoomMessage} from "./dto/RoomMessage";
import {User} from "./User";
import CommonInsert from "../../model/add/common";
import Find from "../../model/find/user";
import {AuthMsgBelongingToBetweenTwoUsers} from "../../util/Types";

export abstract class E2EMessage extends User {

    async getNameOfE2EChat(targetUserId) {
        let e2eChatName = await Find.getTableNameForListOfE2EMessage(this.userId, targetUserId);

        if (!e2eChatName)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        return e2eChatName;
    }

    async uploadFile(tableName: string, message: RoomMessage, conversationType: string) {
        return await CommonInsert.message(tableName, message, {
            conversationType: conversationType
        });
    }

    async isExistChatRoom(obj: AuthMsgBelongingToBetweenTwoUsers) {
        return await Find.isExistChatRoom(obj);
    }

}