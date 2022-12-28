import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class E2EUploadFileService {
    async isExistChatRoom(obj) {
        return await Find.isExistChatRoom(obj);
    }
}
