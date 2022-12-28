import {Injectable} from '@nestjs/common';

let Delete = require("../../../model/remove/user"),
    Create = require("../../../model/create/user");

@Injectable()
export class SavedMessageService {
    async addSavedMessage(userPhone: string) {
        await Create.savedMessage(userPhone);
    }

    async removeSavedMessage(userPhone: string) {
        await Delete.savedMessage(userPhone);
    }

}
