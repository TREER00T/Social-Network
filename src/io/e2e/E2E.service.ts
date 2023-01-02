import {Injectable} from "@nestjs/common";

let Find = require("../../model/find/user");

@Injectable()
export class E2EService {

    async isBlocked(senderId: string, receiverId: string) {
        return await Find.isBlock(senderId, receiverId);
    }

    async isUserMessage(userId: string, messageId: string | string[], tableName: string) {
        return await Find.isMessageBelongForThisUserInE2E(messageId, userId, tableName);
    }

}
