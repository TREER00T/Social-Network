import {Injectable} from '@nestjs/common';
import Delete from "../../../model/remove/user";

let Create = require("../../../model/create/user");

@Injectable()
export class SavedMessageService {
    async addSavedMessage(userId: string) {
        await Create.savedMessage(userId);
    }

    async removeSavedMessage(userId: string) {
        await Delete.savedMessage(userId);
    }
}
