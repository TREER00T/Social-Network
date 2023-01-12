import {Injectable} from '@nestjs/common';
import Insert from "../../../model/add/group";

let Delete = require("../../../model/remove/group");

@Injectable()
export class GroupAdminService {
    async addAdmin(groupId: string, targetUserId: string) {
        await Insert.admin(targetUserId, groupId, 0);
    }

    async removeAdmin(groupId: string, targetUserId: string) {
        await Delete.admin(groupId, targetUserId);
    }
}
