import {Injectable} from '@nestjs/common';
import {PersonalMessage} from "../../base/dto/PersonalMessage";
import Delete from "../../../model/remove/user";
import Insert from "../../../model/add/user";

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalMessageService {
    async addMessage(userId: string, message: PersonalMessage) {
        await Insert.messageIntoUserSavedMessage(userId, message);
    }

    async removeMessageOrListOfMessage(userId: string, data: Array<string>) {
        await Delete.itemInSavedMessage(userId, data);
    }

    async updateMessage(userId: string, messageId: string, message: PersonalMessage) {
        await Update.itemInSavedMessage(userId, messageId, message);
    }
}
