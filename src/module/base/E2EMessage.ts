import {TE2EMessage} from "./dto/TE2EMessage";
import {User} from "./User";
import CommonInsert from "../../model/add/common";
import Find from "../../model/find/user";
import {AuthMsgBelongingToBetweenTwoUsers} from "../../util/Types";

export abstract class E2EMessage extends User {

    async uploadFile(tableName: string, message: TE2EMessage) {
        return await CommonInsert.message(tableName, message);
    }

    async isExistChatRoom(obj: AuthMsgBelongingToBetweenTwoUsers) {
        return await Find.isExistChatRoom(obj);
    }

}