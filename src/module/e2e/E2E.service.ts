import {Injectable} from '@nestjs/common';
import Insert from "../../model/add/user";
import Generate from "../../util/Generate";
import Delete from "../../model/remove/user";
import FindInUser from "../../model/find/user";

let Create = require("../../model/create/user");

@Injectable()
export class E2EService {
    async haveExistRoom(targetUserId: string, userIdWhichCreatedChat: string) {
        let data = await FindInUser.haveExistE2ERoom(targetUserId, userIdWhichCreatedChat);

        return data.length > 0;
    }

    async initializationRoom(targetUserId: string, userIdWhichCreatedChat: string) {
        let tableName = `${Generate.getRandomHash(20)}E2EContents`;

        Create.e2eContent(tableName);

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
