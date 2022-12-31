import {Injectable} from '@nestjs/common';

let Insert = require("../../../model/add/group"),
    Delete = require("../../../model/remove/group");

@Injectable()
export class GroupAdminService {
    async addAdmin(groupId: string, targetUserId: string) {
        await Insert.admin(targetUserId, groupId, 0);
    }

    async removeAdmin(groupId: string, targetUserId: string) {
        await Delete.admin(groupId, targetUserId);
    }
}
