import {Injectable} from '@nestjs/common';
import {Message} from "../../base/dto/Message";

let Find = require("../../../model/find/user"),
    Delete = require("../../../model/remove/user"),
    Update = require("../../../model/update/user"),
    Insert = require("../../../model/add/user");

@Injectable()
export class PersonalAccount {
    async listOfMessageCount(userPhone: string, limit: number) {
        return Math.ceil(await Find.getCountOfListMessage(`${userPhone}SavedMessage`) / limit);
    }

    async listOfMessage(userPhone: string, obj: any) {
        return await Find.getListOfMessage({
            ...obj,
            tableName: `${userPhone}SavedMessage`
        });
    }

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
