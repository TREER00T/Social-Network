import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/group";

@Injectable()
export class GroupInfoService {
    async groupInfo(groupId: string, isOwnerOrAdmin: boolean) {
        return await Find.getInfo(groupId, isOwnerOrAdmin);
    }

    async countOfUsersInGroup(groupId: string) {
        return await Find.getCountOfUsers(groupId);
    }
}
