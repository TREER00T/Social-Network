import {Injectable} from '@nestjs/common';
import DeleteInUser from "../../../model/remove/user";

let Delete = require("../../../model/remove/group");

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
