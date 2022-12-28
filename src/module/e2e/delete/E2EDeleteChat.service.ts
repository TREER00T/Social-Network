import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user"),
    Delete = require("../../../model/remove/user");

@Injectable()
export class E2EDeleteChatService {

    async isUserExist(userId) {
        return await Find.isExist(userId);
    }

    async deleteChatForUs(nameOfE2ERoom: string, from: string, to: string) {
        await Delete.chat(nameOfE2ERoom);
        await Delete.chatInListOfE2EChat(from, to, to);
        await Delete.chatInListOfE2EChat(from, to, from);
    }

    async deleteChatForMe(from: string, to: string) {
        await Delete.chatInListOfE2EChat(from, to, from);
    }
}
