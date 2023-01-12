import {Injectable} from '@nestjs/common';
import {Message} from "../../base/dto/Message";
import Delete from "../../../model/remove/user";
import Insert from "../../../model/add/user";

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalAccount {
    async addMessage(userPhone: string, message: Message) {
        await Insert.messageIntoUserSavedMessage(userPhone, message);
    }

    async removeMessageOrListOfMessage(userPhone: string, data: Array<string>) {
        await Delete.itemInSavedMessage(userPhone, data);
    }

    async updateMessage(userPhone: string, messageId: string, message: Message) {
        await Update.itemInSavedMessage(userPhone, messageId, message);
    }
}
