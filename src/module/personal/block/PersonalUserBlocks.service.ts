import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class PersonalUserBlocksService {
    async listOfBlockedUsers(userId: string) {
        return await Find.getListOfBlockedUsers(userId);
    }

    async userDetails(listOfUserId: object[]) {
        return await Find.getUserDetailsInUsersTable(listOfUserId);
    }
}
