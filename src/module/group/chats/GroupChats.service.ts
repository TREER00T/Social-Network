import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class GroupChatsService {
    async getGroupNameFromListOfUserGroups(groupId: string, userId: string) {
        return await Find.getTableNameForListOfUserGroups(groupId, userId);
    }
}
