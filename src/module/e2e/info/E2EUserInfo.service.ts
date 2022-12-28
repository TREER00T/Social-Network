import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class E2EUserInfoService {
    async userInfo(userId: string) {
        return await Find.getUserPvDetails(userId);
    }

    async isUserExist(userId: string) {
        return await Find.isExist(userId);
    }
}
