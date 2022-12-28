import {Injectable} from '@nestjs/common';
import {Message} from "../../../base/dto/Message";

let Find = require("../../../../model/find/user"),
    CommonInsert = require("../../../../model/add/common");

@Injectable()
export class PersonalUploadFileService {
    async uploadFile(tableName: string, message: Message, conversationType: string) {
        return await CommonInsert.message(tableName, message, {
            conversationType: conversationType
        });
    }

    async isUserExist(userId) {
        return await Find.isExist(userId);
    }
}
