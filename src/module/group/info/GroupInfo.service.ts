import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/group";

@Injectable()
export class GroupInfoService {
    async groupInfo(groupId: string) {
        return await Find.getInfo(groupId);
    }

    async countOfUsersInGroup(groupId: string) {
        return await Find.getCountOfUsers(groupId);
    }
}
