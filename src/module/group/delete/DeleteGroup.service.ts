import {Injectable} from '@nestjs/common';

let Delete = require("../../../model/remove/group"),
    DeleteInUser = require("../../../model/remove/user");

@Injectable()
export class DeleteGroupService {
    async removeGroup(groupId: string) {
        await Delete.groupContent(groupId);
        await Delete.group(groupId);
        await Delete.admins(groupId);
        await Delete.users(groupId);
        await DeleteInUser.groupInListOfUserGroup(groupId);
    }
}
