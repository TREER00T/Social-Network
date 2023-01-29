import {Injectable} from '@nestjs/common';
import {PersonalMessage} from "../../base/dto/PersonalMessage";
import Delete from "../../../model/remove/user";
import Insert from "../../../model/add/user";

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalAccount {
    async addMessage(userPhone: string, userId: string, message: PersonalMessage) {
        await Insert.messageIntoUserSavedMessage(userPhone, userId, message);
    }

    async removeMessageOrListOfMessage(userPhone: string, data: Array<string>) {
        await Delete.itemInSavedMessage(userPhone, data);
    }

    async updateMessage(userPhone: string, messageId: string, message: PersonalMessage) {
        await Update.itemInSavedMessage(userPhone, messageId, message);
    }
}
