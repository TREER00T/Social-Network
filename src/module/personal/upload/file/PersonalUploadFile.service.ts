import {Injectable} from '@nestjs/common';

let Find = require("../../../../model/find/user");

@Injectable()
export class PersonalUploadFileService {
    async updateFile() {

    }

    async isUserExist(userId) {
        return await Find.isExist(userId);
    }
}
