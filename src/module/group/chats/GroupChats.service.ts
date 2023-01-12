import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class GroupChatsService {
    async getGroupNameFromListOfUserGroups(groupId: string, userId: string) {
        return await Find.getTableNameForListOfUserGroups(groupId, userId);
    }
}
