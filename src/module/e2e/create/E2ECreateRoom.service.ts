import {Injectable} from '@nestjs/common';
import Insert from "../../../model/add/user";
import Generate from "../../../util/Generate";

let Create = require("../../../model/create/user");

@Injectable()
export class E2ECreateRoomService {
    async initializationRoom(targetUserId: string, userIdWhichCreatedChat: string) {
        let tableName = `${Generate.getRandomHash(20)}E2EContents`;

        Create.e2eContent(userIdWhichCreatedChat, targetUserId);

        await Insert.chatIdInListOfUserE2E(userIdWhichCreatedChat, targetUserId, userIdWhichCreatedChat, tableName);
        await Insert.chatIdInListOfUserE2E(targetUserId, userIdWhichCreatedChat, targetUserId, tableName);
    }
}
