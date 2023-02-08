import {Injectable} from '@nestjs/common';
import Generate from "../../util/Generate";
import Util from "../../util/Util";
import Insert from "../../model/add/group";
import InsertInUser from "../../model/add/user";
import DeleteInUser from "../../model/remove/user";

let Delete = require("../../model/remove/group");
let Create = require("../../model/create/group");

@Injectable()
export class GroupService {
    async createGroupAndReturnId(groupName: string, avatarUrl?: string) {
        return await Insert.group(groupName.toString().trim(), Generate.makeIdForInviteLink(), Util.getRandomHexColor(), avatarUrl);
    }

    async createGroupContent(userId: string, groupId: string) {
        await Create.groupContent(groupId);
        await Insert.admin(userId, groupId, 1);
        await Insert.user(userId, groupId);
        await InsertInUser.groupIntoListOfUserGroup(groupId, userId);
    }

    async removeGroup(groupId: string) {
        await Delete.groupContent(groupId);
        await Delete.group(groupId);
        await Delete.admins(groupId);
        await Delete.users(groupId);
        await DeleteInUser.groupInListOfUserGroup(groupId);
    }
}
