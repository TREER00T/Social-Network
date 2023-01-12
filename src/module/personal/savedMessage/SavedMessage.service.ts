import {Injectable} from '@nestjs/common';
import Delete from "../../../model/remove/user";

let Create = require("../../../model/create/user");

@Injectable()
export class SavedMessageService {
    async addSavedMessage(userPhone: string) {
        await Create.savedMessage(userPhone);
    }

    async removeSavedMessage(userPhone: string) {
        await Delete.savedMessage(userPhone);
    }

}
