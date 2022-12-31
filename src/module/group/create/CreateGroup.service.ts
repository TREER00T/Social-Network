import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";
import Util from "../../../util/Util";

let Insert = require("../../../model/add/group"),
    InsertInUser = require("../../../model/add/user"),
    Create = require("../../../model/create/group");

@Injectable()
export class CreateGroupService {
    async createGroupAndReturnId(groupName: string, avatarUrl?: string) {
        return await Insert.group(groupName.toString().trim(), Generate.makeIdForInviteLink(), Util.getRandomHexColor(), avatarUrl);
    }

    async createGroupContent(userId: string, groupId: string) {
        await Create.groupContent(groupId);
        await Insert.admin(userId, groupId, 1);
        await Insert.user(userId, groupId);
        await InsertInUser.groupIntoListOfUserGroup(groupId, userId);
    }
}
