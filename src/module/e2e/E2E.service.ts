import {Injectable} from '@nestjs/common';
import Insert from "../../model/add/user";
import Generate from "../../util/Generate";
import Delete from "../../model/remove/user";

let Create = require("../../model/create/user");

@Injectable()
export class E2EService {
    async initializationRoom(targetUserId: string, userIdWhichCreatedChat: string) {
        let tableName = `${Generate.getRandomHash(20)}E2EContents`;

        Create.e2eContent(userIdWhichCreatedChat, targetUserId);

        await Insert.chatIdInListOfUserE2E(userIdWhichCreatedChat, targetUserId, userIdWhichCreatedChat, tableName);
        await Insert.chatIdInListOfUserE2E(targetUserId, userIdWhichCreatedChat, targetUserId, tableName);
    }

    async deleteChatForUs(nameOfE2ERoom: string, from: string, to: string) {
        await Delete.chat(nameOfE2ERoom);
        await Delete.chatInListOfE2EChat(from, to, from);
        await Delete.chatInListOfE2EChat(to, from, to);
    }

    async deleteChatForMe(from: string, to: string) {
        await Delete.chatInListOfE2EChat(from, to, from);
    }
}
